require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 🔥 CONNECT DATABASE SAFELY
(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1); // stop server if DB fails
  }
})();

// 🔥 MIDDLEWARE
app.use(cors({
  origin: "*", // 🔁 change to frontend URL in production
  credentials: true
}));

app.use(express.json());

// 🔥 OPTIONAL: API LOGGER (very useful)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// 🔥 ROUTES
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/bids", require("./routes/bidRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.send("🚀 TaskMarket API Running");
});

// ❌ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ❌ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ msg: "Server error" });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});