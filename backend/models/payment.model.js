import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reservation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      default: null
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ["cash", "card", "momo", "bank_transfer"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending"
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: false } // dùng created_at thủ công
);

export default mongoose.model("Payment", paymentSchema);
