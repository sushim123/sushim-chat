import mongoose from "mongoose";

export const mongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    mongoose.set("strictQuery", true); // Recommended in newer Mongoose versions

    await mongoose.connect(mongoUri, {
      
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log("✅ MongoDB connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error connecting to MongoDB:", error.message);
    } else {
      console.error("❌ Unknown error connecting to MongoDB:", error);
    }
    process.exit(1);
  }
};
