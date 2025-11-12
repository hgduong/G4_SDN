const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        default: 0
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);