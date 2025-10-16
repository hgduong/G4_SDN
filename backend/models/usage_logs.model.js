import mongoose from "mongoose";

const usageLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    computer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Computer",
      required: true,
    },
    service_package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePackage",
      default: null,
    },
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    duration_minutes: { type: Number, default: 0 },
    total_cost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in-progress", "completed", "cancelled"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UsageLog", usageLogSchema);
