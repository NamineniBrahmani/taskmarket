const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessagesByTask,
  deleteMessage,
  getUserMessages
} = require("../controllers/messageController");

const auth = require("../middleware/auth");

// 🟢 SEND MESSAGE
router.post("/", auth, sendMessage);

// 🟣 GET USER MESSAGES (PUT THIS FIRST)
router.get("/user/:userId", auth, getUserMessages);

// 🔵 GET CHAT MESSAGES
router.get("/:taskId", auth, getMessagesByTask);

// 🔴 DELETE MESSAGE
router.delete("/:id", auth, deleteMessage);

module.exports = router;