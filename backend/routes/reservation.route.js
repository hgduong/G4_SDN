import express from "express";
import {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservation.controller.js";

const router = express.Router();

// 🔹 GET tất cả đặt chỗ
router.get("/", getAllReservations);

// 🔹 GET đặt chỗ theo ID
router.get("/:id", getReservationById);

// 🔹 POST tạo đặt chỗ mới
router.post("/", createReservation);

// 🔹 PUT cập nhật đặt chỗ
router.put("/:id", updateReservation);

// 🔹 DELETE xóa đặt chỗ
router.delete("/:id", deleteReservation);

export default router;
