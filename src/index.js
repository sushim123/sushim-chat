import express from "express";
import router from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import { mongoDB } from "./lib/db.js";
import messageRoutes from "./routes/message.routes.js";

dotenv.config();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://sushim-chat.vercel.app",
      "https://3bab4269511e.ngrok-free.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", router);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
  mongoDB();
});
