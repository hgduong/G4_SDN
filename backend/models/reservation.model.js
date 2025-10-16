import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    reservation_id: {
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
    computer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Computer",
      required: true
    },
    start_time: {
      type: Date,
      required: true
    },
    end_time: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);