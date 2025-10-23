const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    // Cấu hình hệ thống
    system: {
      app_name: { type: String, default: "Gaming Center Management" },
      currency: { type: String, default: "VND" },
      timezone: { type: String, default: "Asia/Ho_Chi_Minh" },
      open_hours: { type: String, default: "08:00 - 23:00" },
      support_contact: { type: String, default: "0123-456-789" },
    },

    // Cấu hình giá
    pricing: {
      base_rate_per_hour: { type: Number, default: 10000 },
      night_rate_per_hour: { type: Number, default: 8000 },
      holiday_rate_multiplier: { type: Number, default: 1.5 },
      vip_discount_percent: { type: Number, default: 20 },
    },

    // Cấu hình đồ ăn
    food: {
      enable_food_ordering: { type: Boolean, default: true },
      delivery_time_minutes: { type: Number, default: 15 },
    },

    // Cấu hình thông báo
    notifications: {
      enable_in_app: { type: Boolean, default: true },
      enable_email: { type: Boolean, default: false },
      reminder_before_end_minutes: { type: Number, default: 10 },
    },

    // Giao diện người dùng
    ui: {
      theme: { type: String, enum: ["light", "dark"], default: "dark" },
      language: { type: String, default: "vi" },
      show_dashboard_stats: { type: Boolean, default: true },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = mongoose.model("Setting", settingSchema);
