
import { checkAuth } from "@/controller/auth.controller";
import { protectRoute } from "@/middleware/auth.middleware";

export default protectRoute(checkAuth);
