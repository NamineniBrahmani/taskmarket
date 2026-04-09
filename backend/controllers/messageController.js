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

    // ✅ FIXED FIELD NAMES
    const newMessage = new Message({
      taskId: taskId,
      senderId: senderId,
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

    const messages = await Message.find({ taskId: taskId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching messages" });
  }
};
// 🔴 DELETE MESSAGE
exports.deleteMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const { id } = req.params;

    const msg = await Message.findById(id);

    if (!msg) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (msg.senderId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await msg.deleteOne();

    res.json({ msg: "Message deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting message" });
  }
};

// 🟣 GET USER MESSAGES
exports.getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({ senderId: userId })
      .populate("taskId", "title status")
      .sort({ createdAt: -1 });

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching user messages" });
  }
};