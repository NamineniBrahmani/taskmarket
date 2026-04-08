const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({
        msg: "Access denied. No token provided."
      });
    }

    // ✅ Extract token (clean way)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        msg: "Invalid token format"
      });
    }

    // ❗ Ensure secret exists
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set in environment");
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user
    req.user = {
      id: decoded.id
    };

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        msg: "Session expired. Please login again."
      });
    }

    return res.status(401).json({
      msg: "Unauthorized. Invalid token."
    });
  }
};