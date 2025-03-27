import express from "express";
import { getMessages, getUsersForSidebar ,sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const messageRoutes = express.Router();

messageRoutes.get("/users",protectRoute, getUsersForSidebar);
messageRoutes.get("/:id",protectRoute, getMessages);
messageRoutes.post("/send/:id",protectRoute, sendMessage);
export default messageRoutes;
