const mongoose = require("mongoose");
const { Schema } = mongoose;

// ---- Item ----
const ItemSchema = new Schema({
  item_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// ---- Service Order (Order) ----
const ServiceOrderSchema = new Schema(
  {
    order_id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    computer_id: { type: Number, required: true },
    items: [ItemSchema],
    total_price: { type: Number, required: true },
    order_time: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "in_progress", "delivered", "cancelled"],
      default: "pending",
    },
    staff_id: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceOrder", ServiceOrderSchema);
