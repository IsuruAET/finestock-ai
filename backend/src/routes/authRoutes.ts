import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserInfo,
} from "../controllers/authControllers";
import { protectedRoute, publicRoute } from "../middleware/commonMiddleware";

const router = Router();

router.post("/register", ...publicRoute, registerUser);
router.post("/login", ...publicRoute, loginUser);
router.get("/getUser", ...protectedRoute, getUserInfo);

export default router;
