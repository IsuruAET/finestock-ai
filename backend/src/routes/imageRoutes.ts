import { Router } from "express";
import { uploadImage, deleteImage } from "../controllers/imageControllers";
import { upload } from "../middleware/uploadMiddleware";
import { protectedRoute } from "../middleware/commonMiddleware";

const router = Router();

router.post("/upload", ...protectedRoute, upload, uploadImage);
router.delete("/:id", ...protectedRoute, deleteImage);

export default router;
