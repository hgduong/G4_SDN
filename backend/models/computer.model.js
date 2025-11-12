const mongoose = require("mongoose");

const computerSchema = new mongoose.Schema(
  {
    computer_name: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "in-use", "maintenance", "reserved"],
      default: "available",
    },
    specs: {
      cpu: { type: String, required: true },
      gpu: { type: String, required: true },
      ram: { type: String, required: true },
      storage: { type: String, required: true },
    },
    hourly_rate: { type: Number, required: true, min: 0 },

    // Người dùng hiện tại (nếu đang "in-use")
    current_user: {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      username: { type: String, default: null },
    },

    last_maintenance: { type: Date },
    room: { type: String, required: true },
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
  }
);

// 🔹 Tự động thêm id tự sinh (MongoDB sẽ tự tạo _id)
module.exports = mongoose.model("Computer", computerSchema);
