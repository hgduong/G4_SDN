import Reservation from "../models/Reservation.js";

// 🔹 Lấy tất cả đặt chỗ
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user_id")
      .populate("computer_id");
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Tạo đặt chỗ mới
export const createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy đặt chỗ theo ID
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user_id")
      .populate("computer_id");
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Cập nhật đặt chỗ
export const updateReservation = async (req, res) => {
  try {
    const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Xóa đặt chỗ
export const deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
