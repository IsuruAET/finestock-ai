import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserInfo,
} from "../controllers/authControllers";
import { protectedRoute, publicRoute } from "../middleware/commonMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { registerSchema, loginSchema } from "../validations/authValidations";

const router = Router();

router.post("/register", ...publicRoute, validate(registerSchema), registerUser);
router.post("/login", ...publicRoute, validate(loginSchema), loginUser);
router.post("/refresh-token", ...publicRoute, refreshToken);
router.post("/logout", ...publicRoute, logoutUser);
router.get("/getUser", ...protectedRoute, getUserInfo);

export default router;
