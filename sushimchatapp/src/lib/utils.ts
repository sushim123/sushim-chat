import jwt from "jsonwebtoken";
import * as cookie from "cookie";

const generateToken = (userId: string, res: any): string => {
  
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not found");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", 
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })
  )

  return token;
};

export default generateToken;