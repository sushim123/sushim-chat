import express from "express";
import { signup, login ,updateProfile, checkAuth, logout, updateFullName} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile",protectRoute,updateProfile);
router.put("/update-fullname",protectRoute,updateFullName);
//checking route with a procted route
router.get("/check",protectRoute,checkAuth);

export default router;
