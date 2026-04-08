const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Message too long"],
      validate: {
        validator: function (val) {
          return val.trim().length > 0;
        },
        message: "Message cannot be empty"
      }
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Fast chat loading
messageSchema.index({ task: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);