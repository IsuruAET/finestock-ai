// Image Request Types
export interface CreateImageData {
  userId: string;
  s3Key: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  imageType?: string;
}

// Image Response Types
export interface ImageResponse {
  id: string;
  imageUrl: string;
  imageType: string;
}

