
import User from "../modules/user.model";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary";
import generateToken from "../lib/utils"; 
import { mongoDB } from "../lib/db"; 
import { NextApiRequest, NextApiResponse } from "next/types.js";

export const signup = async (req: NextApiRequest, res: NextApiResponse) => {
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

    const token = generateToken(newUser._id, res); 

    console.log("User created:", newUser);
    return res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePic: newUser.profilePic,
      token: token,
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
  await mongoDB(); 
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
    const token = generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic, 
      token: token, 
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
   
    res.setHeader(
      "Set-Cookie",
      `jwt=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure`
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
  await mongoDB(); 
  try {
    const { profilePic } = req.body;
    const userId = (req as any).user._id; 
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
  await mongoDB();
  try {
    const { fullName } = req.body;
    const userId = (req as any).user._id;
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
  await mongoDB();
  try {
    res.setHeader("Cache-Control", "no-store");
    const authenticatuser = (req as any).user;
    const newToken = generateToken(authenticatuser._id, res);
    return res.status(200).json({
      _id: authenticatuser._id,
      fullName: authenticatuser.fullName,
      email: authenticatuser.email,
      profilePic: authenticatuser.profilePic,
      token: newToken,
    }); 
  } catch (error) {
    console.error("error in checkAuth controller", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
