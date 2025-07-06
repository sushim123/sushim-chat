import User from "../../../modules/user.model";
import { mongoDB } from "../../../lib/db";

const getUser = async (req, res) => {
  await mongoDB();

  try {
    const findUsers = await User.find();

    res.json({ users: findUsers });

    return;
  } catch (error) {
    console.log("User cannot be fetched", error.message);
  }
};
export default getUser;
