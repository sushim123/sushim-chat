import mongoose from "mongoose";

export const mongoDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoDB connected succesfully");
  } catch (error) {
    console.error("error connecting to mongoDB",error.message);
  }
};
