import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://sushim-chat.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Track connected users
const userSocketMap: Record<string, string> = {};

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`Mapped user ${userId} to socket ${socket.id}`);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  } else {
    console.warn("Connection without userId query param");
    socket.disconnect();
  }
});

export { io, server, app };
