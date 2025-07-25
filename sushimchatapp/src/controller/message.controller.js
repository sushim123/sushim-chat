import User from "@/modules/user.model";
import { mongoDB } from "@/lib/db";
import Message from "@/modules/message.model";
import cloudinary from "@/lib/cloudinary";
import { getReceiverSocketId } from "@/lib/socket";

export const getUser = async (req, res) => {
  try {
    mongoDB();

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );

    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSecondUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ Message: "Internal Server error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.query;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: receiverId, receiverId: myId },
        { senderId: myId, receiverId: receiverId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessages function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id;

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required." });
    }
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const reciverSocketId = getReceiverSocketId(receiverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessage);
      console.log("Emitting new message to:", reciverSocketId);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error in sendMessage controller:", error); // log full error
    res.status(500).json({ error: "Internal Server Error" });
  }
};
