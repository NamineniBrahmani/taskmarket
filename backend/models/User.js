const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Name too long"]
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"]
    },

    // 🚫 REMOVED ROLE SYSTEM COMPLETELY

    wallet: {
      type: Number,
      default: 1000,
      min: 0
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { timestamps: true }
);

// 🔥 Index for faster login
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);