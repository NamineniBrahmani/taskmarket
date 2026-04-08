const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Title too long"]
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Description too long"]
    },

    category: {
      type: String,
      enum: ["Delivery", "Assignment", "Cleaning", "Shopping", "Other"],
      default: "Other"
    },

    budget: {
      type: Number,
      required: true,
      min: [1, "Budget must be greater than 0"]
    },

    deadline: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Deadline must be in the future"
      }
    },

    status: {
      type: String,
      enum: ["open", "assigned", "in-progress", "completed"],
      default: "open",
      index: true
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // 🔐 OTP System
    otp: {
      type: String,
      default: null
    },

    otpExpires: {   // ✅ ADD THIS
      type: Date,
      default: null
    },

    otpVerified: {
      type: Boolean,
      default: false
    },

    // 💳 Payment Tracking
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// 🔥 Indexes
taskSchema.index({ postedBy: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model("Task", taskSchema);