import jwt from "jsonwebtoken";
import * as cookie from "cookie";

const generateToken = (userId: string, res: any) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not found");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const serializedCookie = cookie.serialize("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", 
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  res.setHeader("Set-Cookie", serializedCookie); 

  return token;
};

export default generateToken;