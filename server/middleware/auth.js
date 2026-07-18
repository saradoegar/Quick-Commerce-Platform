const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const id = payload.id || payload._id || payload.userId;
    if (!id) return res.status(401).json({ message: "Invalid authentication token" });
    req.user = { id, role: payload.role || "user" };
    next();
  } catch (_) { return res.status(401).json({ message: "Invalid or expired authentication token" }); }
};

const adminOnly = (req, res, next) => req.user?.role === "admin" ? next() : res.status(403).json({ message: "Admin access required" });
module.exports = { protect, adminOnly };
