import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
} from "../controllers/authControllers";
import { protectedRoute, publicRoute } from "../middleware/commonMiddleware";
import { validate } from "../middleware/validationMiddleware";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../validations/authValidations";

const router = Router();

router.post("/register", ...publicRoute, validate(registerSchema), register);
router.post("/login", ...publicRoute, validate(loginSchema), login);
router.post("/refresh-token", ...publicRoute, refreshToken);
router.post("/logout", ...publicRoute, logout);
router.get("/me", ...protectedRoute, getProfile);
router.put(
  "/me",
  ...protectedRoute,
  validate(updateProfileSchema),
  updateProfile
);

export default router;
