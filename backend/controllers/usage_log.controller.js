const UsageLog = require("../models/usage_log.model.js");

// 🔹 Lấy tất cả usage logs
const getAllUsageLogs = async (req, res) => {
  try {
    const logs = await UsageLog.find()
      .populate("user_id")
      .populate("computer_id")
      .populate("service_package_id");
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Tạo usage log mới
const createUsageLog = async (req, res) => {
  try {
    const usageLog = new UsageLog(req.body);
    await usageLog.save();
    res.status(201).json(usageLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy usage log theo ID
const getUsageLogById = async (req, res) => {
  try {
    const log = await UsageLog.findById(req.params.id)
      .populate("user_id")
      .populate("computer_id")
      .populate("service_package_id");
    if (!log) return res.status(404).json({ message: "Usage log not found" });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Cập nhật usage log
const updateUsageLog = async (req, res) => {
  try {
    const updated = await UsageLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Usage log not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Xóa usage log
const deleteUsageLog = async (req, res) => {
  try {
    const deleted = await UsageLog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Usage log not found" });
    res.status(200).json({ message: "Usage log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsageLogs, createUsageLog, getUsageLogById, updateUsageLog, deleteUsageLog };
