import User from "../modules/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
export const signup = async (req, res) => {
  const { email, password, fullName, profilePic } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "user already exist" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      profilePic,
    });
    if (newUser) {
      await newUser.save();
      console.log(newUser);
      res.status(201),
        json({
          email: newUser.email,
          fullName: newUser.fullName,
          password: newUser.password,
          profilePic: newUser.profilePic,
        });
    } else {
      res.status(400).json({ message: "invalid userData" });
    }
  } catch (error) {
    console.error("error in signup", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.status(200).json({
      message: "Login Successful with data:",
      email: user.email,
      password: user.password,
    });
  } catch (error) {
    console.error("Error in login", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.staus(400).json({ message: "profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updating profile pic", error.message);
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
