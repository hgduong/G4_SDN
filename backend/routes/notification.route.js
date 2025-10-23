const express = require("express");
const {
  getAllNotifications,
  getNotificationsByUser,
  createNotification,
  markAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const router = express.Router();

// Định nghĩa các route cho notification
router.get("/", getAllNotifications);                 // Lấy tất cả
router.get("/user/:userId", getNotificationsByUser);  // Lấy theo user
router.post("/", createNotification);                 // Tạo mới
router.put("/:id/read", markAsRead);                  // Đánh dấu đã đọc
router.delete("/:id", deleteNotification);            // Xóa thông báo

module.exports = router;
