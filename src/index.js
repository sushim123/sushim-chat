import express from "express";
import router from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { mongoDB } from "./lib/db.js";
import messageRoutes from "./routes/message.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", router);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  mongoDB();
});
