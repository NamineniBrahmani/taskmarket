const express = require("express");
const router = express.Router();

const bidController = require("../controllers/bidController");
const auth = require("../middleware/auth"); // 🔥 IMPORTANT

// 🟢 PLACE BID (requires login)
router.post("/", auth, bidController.placeBid);

// 🟣 GET USER BIDS (requires login)
router.get("/user/:userId", auth, bidController.getUserBids);

// 🔵 GET BIDS FOR A TASK (public or protected - your choice)
router.get("/:taskId", bidController.getBidsByTask);

// 🔴 DELETE BID (only owner)
router.delete("/:id", auth, bidController.deleteBid);

module.exports = router;