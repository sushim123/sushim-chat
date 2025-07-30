import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express(); // This 'app' is also used in your main index.js, which is correct.

const server = http.createServer(app); // HTTP server created using your express app

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://sushim-chat.vercel.app", // Your Vercel frontend
      "https://3bab4269511e.ngrok-free.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

const userSocketMap = {}; // Maps userId to socket.id
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user is connected", socket.id);

  const userId = socket.handshake.query.userId; // Getting userId from query params

  userSocketMap[userId] = socket.id;
  console.log("user id is", userId);
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user is disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
