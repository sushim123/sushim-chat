import jwt from "jsonwebtoken";
import User from "../modules/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Log both the header and cookie values
    console.log("🧪 Authorization Header:", req.headers.authorization);
    console.log("🧪 Cookie JWT:", req.cookies?.jwt);

    // 1. Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. If not in header, check cookie
    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      console.warn("❌ No token provided in header or cookie");
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // 4. Ensure userId is present
    if (!decoded?.userId) {
      console.warn("❌ Token decoded but no userId found");
      return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
    }

    // 5. Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.warn("❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🔥 protectRoute error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
