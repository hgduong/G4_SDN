import mongoose from "mongoose";
const { Schema } = mongoose;

// ---- Food Item ----
const FoodItemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["food", "drink"], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

// ---- Computer Info ----
const ComputerInfoSchema = new Schema({
  computer_id: { type: String, required: true },
  name: String,
  location: String,
  specs: String,
  replaced_from: String,
});

// ---- Payment Info ----
const PaymentInfoSchema = new Schema({
  method: { type: String, enum: ["direct", "indirect"], required: true },
  provider: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  timestamp: { type: Date, default: Date.now },
});

// ---- Service Package ----
const ServicePackageSchema = new Schema({
  package_id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["combo", "rent", "change"], required: true },
  duration: { type: String },
  price: { type: Number, required: true },
});

// ---- Service Order ----
const ServiceOrderSchema = new Schema(
  {
    order_id: { type: String, required: true, unique: true },
    customer_name: { type: String, required: true },
    customer_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    service_package: { type: ServicePackageSchema, required: true },
    food_items: [FoodItemSchema],
    computer: ComputerInfoSchema,
    payment: { type: PaymentInfoSchema, required: true },
    total_price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "serving", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceOrder", ServiceOrderSchema);
