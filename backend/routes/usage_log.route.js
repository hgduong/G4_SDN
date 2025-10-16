import express from "express";
import {
  getAllUsageLogs,
  getUsageLogById,
  createUsageLog,
  updateUsageLog,
  deleteUsageLog,
} from "../controllers/usage_log.controller.js";

const router = express.Router();

// 🔹 GET tất cả usage logs
router.get("/", getAllUsageLogs);

// 🔹 GET usage log theo ID
router.get("/:id", getUsageLogById);

// 🔹 POST tạo usage log mới
router.post("/", createUsageLog);

// 🔹 PUT cập nhật usage log
router.put("/:id", updateUsageLog);

// 🔹 DELETE xóa usage log
router.delete("/:id", deleteUsageLog);

export default router;
