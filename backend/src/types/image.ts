import { ImageType } from "./models";

// Image Request Types (explicit fields for clarity, derived from IImage model)
export interface CreateImageData {
  userId: string;
  s3Key: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  imageType?: ImageType;
}

// Image Response Types
export interface ImageResponse {
  id: string;
  imageUrl: string;
  imageType: ImageType;
}

