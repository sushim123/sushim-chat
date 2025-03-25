import User from "../modules/user.model.js";

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({message:"Login Successful with data:",email:user.email,password:user.password});
    } else {
      res.status(400).json({ message: "email does not exist" });
    }
  } catch (error) {
    console.error("error in login", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
