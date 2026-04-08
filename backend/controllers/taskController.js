const Task = require("../models/Task");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// 🟢 CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, budget, deadline, category } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const task = new Task({
      title,
      description,
      budget: Number(budget),
      deadline: new Date(deadline),
      category,
      postedBy: req.user.id,
      status: "open"
    });

    await task.save();

    res.status(201).json({ msg: "Task created", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔵 GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const { search, sort, status } = req.query;

    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (status) query.status = status;

    let sortOption = {};
    if (sort === "low") sortOption.budget = 1;
    if (sort === "high") sortOption.budget = -1;
    if (sort === "deadline") sortOption.deadline = 1;

    const tasks = await Task.find(query)
      .sort(sortOption)
      .populate("postedBy", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟡 GET TASK BY ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate("assignedTo", "name email");

    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟣 ASSIGN TASK
exports.assignTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);
    const worker = await User.findById(userId);

    if (!task || !worker)
      return res.status(404).json({ msg: "Task/User not found" });

    if (task.postedBy.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    task.assignedTo = userId;
    task.status = "assigned";

    await task.save();

    await sendEmail(worker.email, "Task Assigned", `Task: ${task.title}`);

    res.json({ msg: "Task assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔐 GENERATE OTP
exports.generateOTP = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo");

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    task.otp = otp;
    task.otpExpires = Date.now() + 10 * 60 * 1000;

    await task.save();

    await sendEmail(task.assignedTo.email, "OTP", `OTP: ${otp}`);

    res.json({ msg: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔐 VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task.otp !== req.body.otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    task.status = "in-progress";
    task.otpVerified = true;

    await task.save();

    res.json({ msg: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ COMPLETE TASK (🔥 MISSING FIXED)
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    task.status = "completed";

    await task.save();

    res.json({ msg: "Task completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 💳 RELEASE PAYMENT (FINAL CORRECT)
exports.releasePayment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    const poster = await User.findById(task.postedBy);
    const worker = await User.findById(task.assignedTo);

    if ((poster.wallet || 0) < task.budget) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    poster.wallet -= task.budget;
    worker.wallet += task.budget;

    await poster.save();
    await worker.save();

    task.paymentStatus = "paid";
    await task.save();

    res.json({ msg: "Payment released" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟣 USER TASKS
exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { postedBy: req.params.userId },
        { assignedTo: req.params.userId }
      ]
    })
      .populate("postedBy", "name")
      .populate("assignedTo", "name");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user tasks" });
  }
};