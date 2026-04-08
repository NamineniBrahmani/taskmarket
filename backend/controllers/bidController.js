const Bid = require("../models/Bid");
const Task = require("../models/Task");

// 🟢 PLACE BID
exports.placeBid = async (req, res) => {
  try {
    const { taskId, bidAmount, message, deadline } = req.body;

    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    // 🔒 Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const userId = req.user.id;

    // 🔍 Validation
    if (!taskId || !bidAmount || !deadline) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (isNaN(bidAmount)) {
      return res.status(400).json({ msg: "Invalid bid amount" });
    }

    // 🔍 Check task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // ❌ Prevent bidding on own task
    if (task.postedBy.toString() === userId) {
      return res.status(400).json({ msg: "You cannot bid on your own task" });
    }

    // ❌ Prevent bidding if not open
    if (task.status !== "open") {
      return res.status(400).json({ msg: "Bidding is closed for this task" });
    }

    // ❌ Prevent duplicate bid (FIXED FIELD NAMES)
    const existingBid = await Bid.findOne({
      task: taskId,
      bidder: userId
    });

    if (existingBid) {
      return res.status(400).json({ msg: "You have already placed a bid" });
    }

    // ✅ Create bid (FIXED FIELD NAMES)
    const bid = new Bid({
      task: taskId,
      bidder: userId,
      amount: Number(bidAmount),
      message,
      deadline: new Date(deadline)
    });

    await bid.save();

    res.status(201).json({
      msg: "Bid placed successfully",
      bid
    });

  } catch (err) {
    console.error("PLACE BID ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🔵 GET BIDS FOR A TASK
exports.getBidsByTask = async (req, res) => {
  try {
    const bids = await Bid.find({ task: req.params.taskId })
      .populate("bidder", "name email")
      .sort({ amount: 1 });

    res.json(bids);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching bids" });
  }
};


// 🟣 GET USER BIDS
exports.getUserBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.params.userId })
      .populate("task", "title budget status")
      .sort({ createdAt: -1 });

    res.json(bids);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching user bids" });
  }
};


// 🔴 DELETE BID
exports.deleteBid = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ msg: "Bid not found" });
    }

    // 🔒 Only owner can delete
    if (bid.bidder.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await bid.deleteOne();

    res.json({ msg: "Bid deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting bid" });
  }
};