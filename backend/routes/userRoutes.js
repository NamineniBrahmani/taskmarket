const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateWallet,
  getWallet
} = require("../controllers/userController");

// 🟢 AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// 💳 WALLET (only own wallet)
router.get("/wallet/:id", auth, getWallet);
router.put("/wallet/:id", auth, updateWallet);

// 👤 PROFILE (only own profile)
router.get("/:id", auth, getUserProfile);

// 🔐 ADMIN (optional - keep protected)
router.get("/", auth, getAllUsers);

module.exports = router;