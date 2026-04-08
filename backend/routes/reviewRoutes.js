const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// 🟢 ADD REVIEW
router.post("/", auth, async (req, res) => {
  try {
    const { taskId, reviewee, rating, comment } = req.body;

    // 🔍 Validation
    if (!taskId || !reviewee || !rating) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be 1-5" });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 🔒 Only involved users can review
    const isPoster = task.postedBy.toString() === req.user.id;
    const isWorker =
      task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isPoster && !isWorker) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // ❌ Prevent duplicate review (FIXED)
    const existing = await Review.findOne({
      task: taskId,
      reviewer: req.user.id
    });

    if (existing) {
      return res.status(400).json({ msg: "You already reviewed this task" });
    }

    // ✅ Create review (FIXED)
    const review = new Review({
      task: taskId,
      reviewer: req.user.id,
      reviewee,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({
      msg: "Review added successfully",
      review
    });

  } catch (err) {
    console.error("ADD REVIEW ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🔵 GET REVIEWS FOR USER
router.get("/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewee: req.params.userId
    })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (err) {
    console.error("GET REVIEWS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;