const Message = require("../models/Message");
const Task = require("../models/Task");

// 🟢 SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { taskId, message } = req.body;

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    // 🔒 Require auth
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const senderId = req.user.id;

    // 🔍 Validation
    if (!taskId || !message || message.trim() === "") {
      return res.status(400).json({ msg: "Task ID and message are required" });
    }

    // 🔍 Check task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔒 Only poster or assigned worker
    const isPoster = task.postedBy.toString() === senderId;
    const isWorker =
      task.assignedTo && task.assignedTo.toString() === senderId;

    if (!isPoster && !isWorker) {
      return res.status(403).json({ msg: "Not authorized to send message" });
    }

    // ✅ Create message (FIXED FIELD NAMES)
    const newMessage = new Message({
      task: taskId,
      sender: senderId,
      content: message.trim()
    });

    await newMessage.save();

    const populatedMessage = await newMessage.populate("sender", "name");

    res.status(201).json({
      msg: "Message sent successfully",
      data: populatedMessage
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// 🔵 GET CHAT HISTORY
exports.getMessagesByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const messages = await Message.find({ task: taskId })
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

    // 🔒 Only sender can delete
    if (msg.sender.toString() !== req.user.id) {
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

    const messages = await Message.find({ sender: userId })
      .populate("task", "title status")
      .sort({ createdAt: -1 });

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching user messages" });
  }
};