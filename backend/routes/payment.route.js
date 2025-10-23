const express = require("express");
const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  assignComputer,
} = require("../controllers/payment.controller.js");

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

// 🔹 POST gán máy cho payment đã hoàn thành
router.post("/:id/assign-computer", assignComputer);

module.exports = router;
