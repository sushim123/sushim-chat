import jwt from "jsonwebtoken";
import User from "@/modules/user.model";
import { mongoDB } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

declare module "next" {
  interface NextApiRequest {
    user?: any;
  }
}

export const protectRoute = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await mongoDB();

      const token = req.cookies?.jwt;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: Login First " });
      }

      const jwtSecret = process.env.JWT_SECRET!;
      const decoded = jwt.verify(token, jwtSecret);

      const userId = (decoded as jwt.JwtPayload).userId;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;

      return handler(req, res);
    } catch (error) {
      console.error("protectRoute error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
