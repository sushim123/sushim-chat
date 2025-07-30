import User from "@/modules/user.model";
import { mongoDB } from "@/lib/db";
import Message from "@/modules/message.model";
import cloudinary from "@/lib/cloudinary";
import { io, getReceiverSocketId } from "@/lib/socket";
import { NextApiRequest, NextApiResponse } from "next/types";

export const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in getUsersForSidebar:", error.message);
    } else {
      console.error("getUsersForSidebar:", error);
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSecondUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ Message: "Internal Server error" });
    } else {
      console.error("Internal Server error:", error);
    }
  }
};
export const getMessages = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in getMessages function", error.message);
    } else {
      console.error("Unknown error in getMessages:", error);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error in sendMessage controller:", error);
    } else {
      console.error("Unknown error in sendMessage:", error);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteMessage = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    await mongoDB();
    const messageId = req.query.id;
    if (!messageId) {
      return res.status(400).json({ error: "Message ID is required." });
    }
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(400).json({ error: "Message Not found" });
    }
    await Message.findByIdAndDelete(messageId);
    res.json({ message: "Message Delete Successfully ", status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error in deleteMessage controller:", error);
    } else {
      console.error("Unknown error in deleteMessage:", error);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
