const Message = require("../models/Message");
const Task = require("../models/Task");

// 🟢 SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { taskId, message } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const senderId = req.user.id;

    if (!taskId || !message || message.trim() === "") {
      return res.status(400).json({ msg: "Task ID and message are required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    const isPoster = task.postedBy.toString() === senderId;
    const isWorker =
      task.assignedTo && task.assignedTo.toString() === senderId;

    if (!isPoster && !isWorker) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const newMessage = new Message({
      taskId,
      senderId,
      message: message.trim()
    });

    await newMessage.save();

    const populatedMessage = await newMessage.populate("senderId", "name");

    res.status(201).json(populatedMessage);

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};

// 🔵 GET CHAT HISTORY
exports.getMessagesByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const messages = await Message.find({ taskId })
      .populate("senderId", "name")
      .sort({ createdAt