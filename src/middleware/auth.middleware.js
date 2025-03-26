import jwt from "jsonwebtoken";
import User from "../modules/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "User is unauthorized -No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    const user = User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    console.log("error is protect route middleware",error.message);
    res.status(500).json({ message: "Internal Server Errror" });
  }
};
