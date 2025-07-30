// In your Next.js project: pages/api/auth/signup.ts, pages/api/auth/login.ts, pages/api/auth/logout.ts
// Or app/api/auth/signup/route.ts, etc.

import User from "../modules/user.model";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary"; // Assuming this is correct path
import generateToken from "../lib/utils"; // Your generateToken utility
import { mongoDB } from "../lib/db"; // Assuming this is correct path
import { NextApiRequest, NextApiResponse } from "next/types.js";

export const signup = async (req: NextApiRequest, res: NextApiResponse) => {
  await mongoDB(); // Ensure DB connection

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password, fullName } = req.body;

  try {
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long" });
    }
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate token and set cookie
    const token = generateToken(newUser._id, res); // Get the token value

    console.log("User created:", newUser);

    // Return user data AND the token in the JSON response
    return res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic, // Include profilePic if available in User model
      token: token, // <-- CRITICAL: Send token in response body for Zustand store
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in signup:", error.message);
    } else {
      console.error("Unknown error in signup:", error);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  await mongoDB(); // Ensure DB connection
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate token and set cookie
    const token = generateToken(user._id, res); // Get the token value

    // Return user data AND the token in the JSON response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic, // Include profilePic if available in User model
      token: token, // <-- CRITICAL: Send token in response body for Zustand store
    });
    console.log("login successful");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in login", error.message);
    } else {
      console.error("unknown error in login");
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Clear the JWT cookie with appropriate SameSite and Secure flags
    res.setHeader(
      "Set-Cookie",
      `jwt=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure` // <-- Use SameSite=None; Secure for consistency
    );
    res.status(200).json({ message: "Logged out successfully" });
    console.log("Logged out successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in Logging Out controller", error.message);
    } else {
      console.error("Unknown error in Logout:", error);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await mongoDB(); // Ensure DB connection
  try {
    const { profilePic } = req.body;
    const userId = (req as any).user._id; // Cast req to any to access req.user
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).lean();
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in Update profile Out controller", error.message);
    } else {
      console.error("Unknown error in Update profile:", error);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFullName = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await mongoDB(); // Ensure DB connection
  try {
    const { fullName } = req.body;
    const userId = (req as any).user._id; // Cast req to any to access req.user
    if (!fullName) {
      return res.status(400).json({ message: "fullName is required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName },
      { new: true }
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in updateFullName controller", error.message);
    } else {
      console.error("Unknown error in updateFullName:", error);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  await mongoDB(); // Ensure DB connection
  try {
    res.setHeader("Cache-Control", "no-store");
    // Assuming req.user is populated by a middleware that verifies the JWT cookie
    // If you want to return the token here, you'd need to re-generate it or store it on req.user
    // For now, let's assume req.user is enough for checkAuth, but if useAuthStore needs token,
    // you might need to adjust this.
    return res.status(200).json((req as any).user); // Cast req to any to access req.user
  } catch (error) {
    console.error("error in checkAuth controller", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
