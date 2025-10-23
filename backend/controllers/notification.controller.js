const Notification = require("../models/notification.model");

// 🟢 Lấy tất cả thông báo
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ created_at: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách thông báo", error });
  }
};

// 🟢 Lấy thông báo theo user_id
const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ user_id: userId }).sort({ created_at: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông báo của người dùng", error });
  }
};

// 🟢 Tạo thông báo mới
const createNotification = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.status(201).json({ message: "Tạo thông báo thành công", data: newNotification });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo thông báo", error });
  }
};

// 🟢 Đánh dấu thông báo là đã đọc
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }
    res.status(200).json({ message: "Đã đánh dấu là đã đọc", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật thông báo", error });
  }
};

// 🟢 Xóa thông báo
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }
    res.status(200).json({ message: "Đã xóa thông báo", data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa thông báo", error });
  }
};

// Xuất ra các controller
module.exports = {
  getAllNotifications,
  getNotificationsByUser,
  createNotification,
  markAsRead,
  deleteNotification,
};
