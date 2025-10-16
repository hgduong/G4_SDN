import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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

export default mongoose.model("User", userSchema);