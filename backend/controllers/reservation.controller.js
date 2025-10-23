import mongoose from "mongoose";
import Reservation from "../models/Reservation.js";
import User from "../models/user.model.js";
import Computer from "../models/computer.model.js";

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
export const getAllReservations = async (req, res) => {
  try {
    const { page = 1, limit = 50, user_id, computer_id, status } = req.query;
    const filter = {};
    if (user_id && isObjectId(user_id)) filter.user_id = user_id;
    if (computer_id && isObjectId(computer_id)) filter.computer_id = computer_id;
    if (status) filter.status = status;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const reservations = await Reservation.find(filter)
      .populate("user_id", "username email")
      .populate("computer_id", "computer_name status room")
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
export const createReservation = async (req, res) => {
  try {
    const { user_id, computer_id, start_time, end_time, notes } = req.body;

    // Basic validation
    if (!user_id || !computer_id || !start_time || !end_time) {
      return res.status(400).json({ message: "user_id, computer_id, start_time and end_time are required" });
    }

    if (!isObjectId(user_id) || !isObjectId(computer_id)) {
      return res.status(400).json({ message: "Invalid user_id or computer_id" });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Invalid start_time/end_time: ensure start < end and proper dates" });
    }

    // Existence checks
    const [user, computer] = await Promise.all([
      User.findById(user_id).lean(),
      Computer.findById(computer_id).lean(),
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!computer) return res.status(404).json({ message: "Computer not found" });

    // Optionally: check computer availability during the requested slot
    const overlapping = await Reservation.findOne({
      computer_id: computer_id,
      $or: [
        { start_time: { $lt: end }, end_time: { $gt: start } },
      ],
      status: { $in: ["pending", "confirmed"] },
    }).lean();
    if (overlapping) {
      return res.status(409).json({ message: "Computer is already reserved for the requested time range" });
    }

    // create reservation_id if not provided
    const reservation_id = req.body.reservation_id || `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const reservation = new Reservation({
      reservation_id,
      user_id,
      computer_id,
      start_time: start,
      end_time: end,
      notes,
    });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy đặt chỗ theo ID (an toàn)
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const reservation = await Reservation.findById(id)
      .populate("user_id", "username email")
      .populate("computer_id", "computer_name status room");
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Cập nhật đặt chỗ với kiểm tra
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const updates = { ...req.body };

    // If updating user_id/computer_id, validate format and existence
    if (updates.user_id && !isObjectId(updates.user_id)) return res.status(400).json({ message: "Invalid user_id" });
    if (updates.computer_id && !isObjectId(updates.computer_id)) return res.status(400).json({ message: "Invalid computer_id" });

    if (updates.user_id) {
      const u = await User.findById(updates.user_id).lean();
      if (!u) return res.status(404).json({ message: "User not found" });
    }
    if (updates.computer_id) {
      const c = await Computer.findById(updates.computer_id).lean();
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
        status: { $in: ["pending", "confirmed"] },
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
export const deleteReservation = async (req, res) => {
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
