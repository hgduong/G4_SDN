const mongoose = require("mongoose");
const Reservation = require("../models/reservation.model.js");
const User = require("../models/user.model.js");
const Computer = require("../models/computer.model.js");
const ServicePackage = require("../models/service_package.model.js");
const Setting = require("../models/setting.model.js");

const { Types } = mongoose;

// Helper: validate object id
const isObjectId = (id) => {
  try {
    return Types.ObjectId.isValid(id);
  } catch (e) {
    return false;
  }
};

// 🔹 Lấy tất cả đặt chỗ (hỗ trợ filter và pagination cơ bản)
const getAllReservations = async (req, res) => {
  try {
    const { page = 1, limit = 50, user_id, computer_id, status } = req.query;
    const filter = {};
    if (user_id && isObjectId(user_id)) filter.user_id = user_id;
    if (computer_id) filter.computer_id = computer_id;
    if (status) filter.status = status;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const reservations = await Reservation.find(filter)
      .populate("user_id", "username email")
      .populate("service_package_id", "name price")
      .sort({ start_time: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    const total = await Reservation.countDocuments(filter);
    res.status(200).json({ data: reservations, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Tạo đặt chỗ mới với kiểm tra an toàn
const createReservation = async (req, res) => {
  try {
    const { user_id, room, computer_name, start_time, duration_hours, service_package_id, notes } = req.body;

    // Basic validation
    if (!user_id || !room || !computer_name || !start_time || !duration_hours) {
      return res.status(400).json({ message: "user_id, room, computer_name, start_time and duration_hours are required" });
    }

    if (!isObjectId(user_id)) {
      return res.status(400).json({ message: "Invalid user_id" });
    }

    if (service_package_id && !isObjectId(service_package_id)) {
      return res.status(400).json({ message: "Invalid service_package_id" });
    }

    const start = new Date(start_time);
    const currentTime = new Date();
    if (isNaN(start) || start <= currentTime) {
      return res.status(400).json({ message: "Invalid start_time: must be a future date" });
    }

    if (duration_hours <= 0 || duration_hours > 12) {
      return res.status(400).json({ message: "Invalid duration_hours: must be > 0 and <= 12" });
    }

    const end = new Date(start.getTime() + duration_hours * 60 * 60 * 1000);

    // Existence checks
    const [user, computer] = await Promise.all([
      User.findById(user_id).lean(),
      Computer.findOne({ computer_name, room, status: "available" }).lean(),
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!computer) return res.status(404).json({ message: "Computer not found or not available" });

    // Check overlapping reservations
    const overlapping = await Reservation.findOne({
      computer_id: computer_name,
      $or: [
        { start_time: { $lt: end }, end_time: { $gt: start } },
      ],
      status: { $in: ["pending", "confirmed", "reserved"] },
    }).lean();
    if (overlapping) {
      return res.status(409).json({ message: "⚠ This computer is already reserved at that time." });
    }

    // Get settings
    const settings = await Setting.findOne().lean() || { pricing: { base_rate_per_hour: 10000 } };

    // Calculate cost
    let estimated_cost = duration_hours * computer.hourly_rate;

    let servicePackage = null;
    if (service_package_id) {
      servicePackage = await ServicePackage.findById(service_package_id).lean();
      if (!servicePackage || !servicePackage.isActive) {
        return res.status(400).json({ message: "Invalid or inactive service package" });
      }
      estimated_cost += servicePackage.price;
    }

    // Check user balance
    if (user.balance < estimated_cost) {
      return res.status(400).json({ message: "💰 Please top up your account before reserving." });
    }

    // Create reservation_id
    const reservation_id = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const reservation = new Reservation({
      reservation_id,
      user_id,
      computer_id: computer_name,
      room,
      start_time: start,
      end_time: end,
      estimated_cost,
      service_package_id: service_package_id || null,
      notes,
    });
    await reservation.save();

    // Update computer status to reserved
    await Computer.findByIdAndUpdate(computer._id, { status: "reserved" });

    res.status(201).json({
      reservation,
      message: "Reservation created successfully",
      summary: {
        reservation_id,
        computer_name,
        room,
        start_time: start,
        end_time: end,
        estimated_cost
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy đặt chỗ theo ID (an toàn)
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const reservation = await Reservation.findById(id)
      .populate("user_id", "username email")
      .populate("service_package_id", "name price");
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Cập nhật đặt chỗ với kiểm tra
const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const updates = { ...req.body };

    // If updating user_id, validate
    if (updates.user_id && !isObjectId(updates.user_id)) return res.status(400).json({ message: "Invalid user_id" });

    if (updates.user_id) {
      const u = await User.findById(updates.user_id).lean();
      if (!u) return res.status(404).json({ message: "User not found" });
    }
    if (updates.computer_id) {
      const c = await Computer.findOne({ computer_name: updates.computer_id }).lean();
      if (!c) return res.status(404).json({ message: "Computer not found" });
    }

    // If updating times, validate
    if (updates.start_time || updates.end_time) {
      const existing = await Reservation.findById(id).lean();
      if (!existing) return res.status(404).json({ message: "Reservation not found" });

      const start = updates.start_time ? new Date(updates.start_time) : new Date(existing.start_time);
      const end = updates.end_time ? new Date(updates.end_time) : new Date(existing.end_time);
      if (isNaN(start) || isNaN(end) || start >= end) {
        return res.status(400).json({ message: "Invalid start_time/end_time" });
      }

      // check overlap with other reservations for the same computer
      const overlapping = await Reservation.findOne({
        _id: { $ne: id },
        computer_id: updates.computer_id || existing.computer_id,
        $or: [
          { start_time: { $lt: end }, end_time: { $gt: start } },
        ],
        status: { $in: ["pending", "confirmed", "reserved"] },
      }).lean();
      if (overlapping) {
        return res.status(409).json({ message: "Computer is already reserved for the requested time range" });
      }
    }

    const updated = await Reservation.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Xóa đặt chỗ
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllReservations, createReservation, getReservationById, updateReservation, deleteReservation };
