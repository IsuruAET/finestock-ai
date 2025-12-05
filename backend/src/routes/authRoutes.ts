import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserInfo,
} from "../controllers/authControllers";
import { protectedRoute, publicRoute } from "../middleware/commonMiddleware";

const router = Router();

router.post("/register", ...publicRoute, registerUser);
router.post("/login", ...publicRoute, loginUser);
router.post("/refresh-token", ...publicRoute, refreshToken);
router.post("/logout", ...publicRoute, logoutUser);
router.get("/getUser", ...protectedRoute, getUserInfo);

export default router;
