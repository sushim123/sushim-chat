import User from "../modules/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import generateToken from "../lib/utils.ts";
import { mongoDB } from "../lib/db.js";

export const signup = async (req, res) => {
  await mongoDB();

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
    generateToken(newUser._id, res);
    console.log("User created:", newUser);
    return res.status(201).json({
      email: newUser.email,
      fullName: newUser.fullName,
      _id: newUser._id,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
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
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
    });
    console.log("login successful");
  } catch (error) {
    console.error("Error in login", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
    console.log("Logged out successfully");
  } catch (error) {
    console.log("Error in Logging Out controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
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
  } catch (error) {
    console.log("error in updating profile pic", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateFullName = async (req, res) => {
  try {
    const { fullName } = req.body;
    const userId = req.user._id;
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
  } catch (error) {
    console.log("error in updating fullname", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth controller", error.messsage);
    return res.status(500).json({ message: "internal server error " });
  }
};
