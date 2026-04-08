const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const auth = require("../middleware/auth");

// 📊 USER DASHBOARD
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔥 Tasks posted by user
    const postedTotal = await Task.countDocuments({ postedBy: userId });
    const postedCompleted = await Task.countDocuments({
      postedBy: userId,
      status: "completed"
    });

    // 🔥 Tasks assigned to user (work)
    const workTotal = await Task.countDocuments({ assignedTo: userId });
    const workCompleted = await Task.countDocuments({
      assignedTo: userId,
      status: "completed"
    });

    // 🔥 Open tasks (marketplace)
    const openTasks = await Task.countDocuments({ status: "open" });

    res.json({
      posted: {
        total: postedTotal,
        completed: postedCompleted
      },
      work: {
        total: workTotal,
        completed: workCompleted
      },
      openTasks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching dashboard data" });
  }
});

module.exports = router;