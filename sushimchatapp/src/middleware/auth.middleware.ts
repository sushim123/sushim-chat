import jwt from "jsonwebtoken";
import User from "../modules/user.model.js";
import { NextApiRequest, NextApiResponse } from "next";

declare module "next" {
  interface NextApiRequest {
    user?: any;
  }
}

export const protectRoute = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "User is unauthorized -No token provided" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.log("no secret found in env");
      return res.status(500).json({ message: "No secret found" });
    }
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded || typeof decoded === "string" || !("userId" in decoded)) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    const userId = (decoded as jwt.JwtPayload).userId;
    const user = await User.findById(userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.log("error is protect route middleware", error.message);
    } else {
      console.log("error is protect route middleware", error);
    }
    res.status(500).json({ message: "Internal Server Errror" });
  }
};
