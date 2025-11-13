const mongoose = require("mongoose");

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
      required: false
    },
    computer_id: {
      type: String,
      required: true
    },
    room: {
      type: String,
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
      enum: ["pending", "confirmed", "cancelled", "completed", "reserved"],
      default: "reserved"
    },
    estimated_cost: {
      type: Number,
      required: true,
      min: 0
    },
    service_package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicePackage",
      default: null
    },
    notes: {
      type: String,
      trim: true
    },
    customer_name: {
      type: String,
      trim: true,
      required: true
    },
    already_paid: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);