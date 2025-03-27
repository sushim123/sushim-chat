import User from "../modules/user.model.js";

export const getUsersForSidebar = async(req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    res.status(200).json(filteredUser);
    console.log(filteredUser)
  } catch (error) {
    console.log("Error in getUsersForSidebar", error.message);
    res.status(500).json({ Message: "Internal Server error" });
  }
};
