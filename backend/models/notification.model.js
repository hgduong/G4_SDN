const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  noti_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["system", "user"], default: "system" },
  status: { type: String, enum: ["read", "unread"], default: "unread" },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
