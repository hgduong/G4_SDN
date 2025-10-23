const mongoose = require("mongoose");

const usageLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    computer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Computer",
      required: true
    },
    service_package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePackage",
      default: null
    },
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    total_time: { type: Number, default: 0 }, // phút
    cost: { type: Number, default: 0 },
    session_status: {
      type: String,
      enum: ["in-progress", "completed", "cancelled"],
      default: "in-progress"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UsageLog", usageLogSchema);