const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: [1, "Bid amount must be greater than 0"]
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

    message: {
      type: String,
      maxlength: [300, "Message too long"]
    }
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate bids
bidSchema.index({ task: 1, bidder: 1 }, { unique: true });

module.exports = mongoose.model("Bid", bidSchema);