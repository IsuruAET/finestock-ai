import imageRepository from "../repositories/imageRepository";
import { deleteObject } from "../utils/s3Util";
import { CreateImageData, ImageResponse } from "../types";

export class ImageService {
  async createImage(data: CreateImageData): Promise<ImageResponse> {
    const image = await imageRepository.create(data);
    return {
      id: String(image._id),
      imageUrl: image.url,
      imageType: image.imageType || "general",
    };
  }

  async deleteImage(id: string, userId: string): Promise<boolean> {
    const image = await imageRepository.findById(id);
    if (!image) {
      return false;
    }

    // Verify ownership
    if (String(image.userId) !== userId) {
      throw new Error("Unauthorized: You don't own this image");
    }

    // Delete from S3
    try {
      await deleteObject(image.s3Key);
    } catch (error) {
      console.error("Error deleting from S3:", error);
      // Continue with DB deletion even if S3 deletion fails
    }

    // Delete from database
    return await imageRepository.deleteById(id);
  }
}

export default new ImageService();
