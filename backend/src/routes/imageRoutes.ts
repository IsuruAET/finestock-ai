import { Router } from "express";
import { uploadImage, deleteImage } from "../controllers/imageControllers";
import { upload } from "../middleware/uploadMiddleware";
import { protectedRoute } from "../middleware/commonMiddleware";
import { validate } from "../middleware/validationMiddleware";
import {
  uploadImageSchema,
  deleteImageSchema,
} from "../validations/imageValidations";

const router = Router();

router.post(
  "/upload",
  ...protectedRoute,
  upload,
  validate(uploadImageSchema),
  uploadImage
);
router.delete(
  "/:id",
  ...protectedRoute,
  validate(deleteImageSchema),
  deleteImage
);

export default router;
