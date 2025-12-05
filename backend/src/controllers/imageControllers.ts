import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import imageService from "../services/imageService";

// Upload Image
export const uploadImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!req.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const file = req.file as Express.MulterS3.File;
    const imageType = (req.body.imageType as string) || "GENERAL";

    const imageResponse = await imageService.createImage({
      userId: String(req.user._id),
      s3Key: file.key,
      url: file.location,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      imageType,
    });

    return res.status(200).json(imageResponse);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error uploading image",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// Delete Image
export const deleteImage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const imageId = req.params.id;
  if (!imageId) {
    return res.status(400).json({ message: "Image ID is required" });
  }

  try {
    const deleted = await imageService.deleteImage(
      imageId,
      String(req.user._id)
    );

    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({
        message: "Error deleting image",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};
