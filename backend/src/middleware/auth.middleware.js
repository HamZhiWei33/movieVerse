import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract token from Authorization header or cookies
    let token;

    // Priority: Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      // Fallback to cookie
      token = req.cookies.jwt;
    }

    if (!token) {
      console.log("No token provided in header or cookie");
      return res.status(401).json({ message: "No token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      console.log("Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find user by ID
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
