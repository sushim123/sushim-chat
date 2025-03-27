import express from "express";
import { getMessages, getUsersForSidebar } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const messageRoutes = express.Router();

messageRoutes.get("/users",protectRoute, getUsersForSidebar);
messageRoutes.get("/:id",protectRoute, getMessages);
export default messageRoutes;
