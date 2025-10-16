import express from "express";
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

// 🔹 GET tất cả thanh toán
router.get("/", getAllPayments);

// 🔹 GET thanh toán theo ID
router.get("/:id", getPaymentById);

// 🔹 POST tạo thanh toán mới
router.post("/", createPayment);

// 🔹 PUT cập nhật thanh toán
router.put("/:id", updatePayment);

// 🔹 DELETE xóa thanh toán
router.delete("/:id", deletePayment);

export default router;
