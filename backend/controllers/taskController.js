const Task = require("../models/Task");
const User = require("../models/User");
const Bid = require("../models/Bid");
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
      budget,
      deadline,
      category,
      postedBy: req.user.id // 🔥 THIS WAS MISSING
    });

    await task.save();

    res.status(201).json(task);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ msg: err.message });
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
    const taskId = req.params.id;
    console.log("Incoming userId:", userId);   // 🔥 ADD HERE
    console.log("TaskId:", taskId); 
    console.log("Assigning:", { taskId, userId });

    const task = await Task.findById(taskId);
    console.log("Incoming userId:", userId);
    console.log("TASK:", task);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (!task.postedBy || task.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (task.status !== "open") {
      return res.status(400).json({ msg: "Task already assigned" });
    }
    const allBids = await Bid.find({ taskId: taskId });
console.log("ALL BIDS FOR THIS TASK:", allBids);
    // 🔥 FIX: declare bid BEFORE using it
    const mongoose = require("mongoose");

const bid = await Bid.findOne({
  taskId: new mongoose.Types.ObjectId(taskId),
  userId: new mongoose.Types.ObjectId(userId)
});

    console.log("BID:", bid);

    if (!bid) {
      return res.status(400).json({ msg: "No bid found" });
    }

    // ✅ Assign
    task.assignedTo = userId;
    task.status = "assigned";

    await task.save();

    res.json({ msg: "Task assigned successfully" });

  } catch (err) {
    console.error("ASSIGN ERROR FULL:", err);
    res.status(500).json({ msg: err.message });
  }
};
exports.generateOTP = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // ❌ Only poster can generate OTP
    if (task.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // ❌ Task must be assigned
    if (task.status !== "assigned") {
      return res.status(400).json({
        msg: "Task must be assigned first"
      });
    }

    // ❌ No worker assigned
    if (!task.assignedTo) {
      return res.status(400).json({
        msg: "No worker assigned"
      });
    }

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    task.otp = otp;
    await task.save();

    // 🔥 Get worker email
    const worker = await User.findById(task.assignedTo);

    if (!worker || !worker.email) {
      return res.status(400).json({
        msg: "Worker email not found"
      });
    }

    // 🔥 Send email
    const sendEmail = require("../utils/sendEmail");

    await sendEmail(
      worker.email,
      "Your Task OTP",
      `Your OTP is: ${otp}`
    );

    res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({
      msg: err.message || "Error generating OTP"
    });
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
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔒 Only poster can release payment
    if (task.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // ❌ Must be completed
    if (task.status !== "completed") {
      return res.status(400).json({
        msg: "Task must be completed first"
      });
    }

    // ❌ Already paid
    if (task.paymentStatus === "paid") {
      return res.status(400).json({
        msg: "Payment already released"
      });
    }

    // 🔥 Get users
    const poster = await User.findById(task.postedBy);
    const worker = await User.findById(task.assignedTo);

    if (!poster || !worker) {
      return res.status(400).json({
        msg: "User not found"
      });
    }

    const amount = task.budget;

    // ❌ Check balance
    if (poster.wallet < amount) {
      return res.status(400).json({
        msg: "Insufficient balance"
      });
    }

    // 💳 Transfer money
    poster.wallet -= amount;
    worker.wallet += amount;

    await poster.save();
    await worker.save();

    // ✅ Update task
    task.paymentStatus = "paid";
    await task.save();

    res.json({
      msg: "Payment released successfully",
      posterWallet: poster.wallet,
      workerWallet: worker.wallet
    });

  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ msg: "Error releasing payment" });
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
exports.getBidsByTask = async (req, res) => {
  try {
    const bids = await Bid.find({ task: req.params.taskId })
      .populate("bidder", "name") // 🔥 THIS IS THE FIX
      .sort({ createdAt: -1 });

    res.json(bids);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching bids" });
  }
};