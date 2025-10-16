
const mongoose = require("mongoose");


const servicePackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    duration_minutes: {
      type: Number,
      default: null
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: true,   // Auto-generate createdAt
      updatedAt: false   // You can set to true if you want auto-updatedAt too
    }
  }
);


const ServicePackage = mongoose.model("ServicePackage", servicePackageSchema);

module.exports = ServicePackage;
