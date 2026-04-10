const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    message: String,
    deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);

// 🔥 Prevent duplicate bids
bidSchema.index({ taskId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Bid", bidSchema);