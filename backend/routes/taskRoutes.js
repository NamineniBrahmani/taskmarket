const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const taskController = require("../controllers/taskController");

// 🟢 CREATE TASK
router.post("/", auth, taskController.createTask);

// 🔵 GET ALL TASKS
router.get("/", taskController.getTasks);

// 🟣 GET USER TASKS (PUT THIS BEFORE :id)
router.get("/user/:userId", auth, taskController.getUserTasks);

// 🟡 GET SINGLE TASK
router.get("/:id", taskController.getTaskById);

// 🟠 ASSIGN TASK
router.put("/:id/assign", auth, taskController.assignTask);

// 🔐 GENERATE OTP
router.put("/:id/generate-otp", auth, taskController.generateOTP);

// 🔐 VERIFY OTP
router.put("/:id/verify-otp", auth, taskController.verifyOTP);

// ✅ COMPLETE TASK
router.put("/:id/complete", auth, taskController.completeTask);

// 💳 RELEASE PAYMENT
router.put("/:id/release-payment", auth, taskController.releasePayment);

module.exports = router;