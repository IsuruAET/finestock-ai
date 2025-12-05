import imageRepository from "../repositories/imageRepository";
import { deleteObject } from "../utils/s3Util";

export interface CreateImageData {
  userId: string;
  s3Key: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  imageType?: string;
}

export interface ImageResponse {
  id: string;
  imageUrl: string;
  imageType: string;
}

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
