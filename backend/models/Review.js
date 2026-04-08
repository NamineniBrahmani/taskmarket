const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"]
    },

    comment: {
      type: String,
      maxlength: [300, "Comment too long"],
      trim: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate reviews
reviewSchema.index(
  { task: 1, reviewer: 1 },
  { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);