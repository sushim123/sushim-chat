import User from "../modules/user.model.js";
import Message from "../modules/message.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    res.status(200).json(filteredUser);
    console.log(filteredUser);
  } catch (error) {
    console.log("Error in getUsersForSidebar", error.message);
    res.status(500).json({ Message: "Internal Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: userToChatId, receiverId: myId },
        { senderId: myId, receiverId: userToChatId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessages function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
