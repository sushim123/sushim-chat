import express from "express";
import { getUsersForSidebar } from "../controllers/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.get("/users", getUsersForSidebar);
export default messageRoutes;
