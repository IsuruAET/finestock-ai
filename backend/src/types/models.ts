import { Document } from "mongoose";
import mongoose from "mongoose";

// Image Type Enum (shared between validation, models, and services)
export type ImageType = "GENERAL" | "PROFILE" | "DOCUMENT";

// User Model
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Image Model (using shared ImageType)
export interface IImage extends Document {
  userId: mongoose.Types.ObjectId;
  s3Key: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  imageType?: ImageType;
  createdAt: Date;
  updatedAt: Date;
}

// Session Model
export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  tokenIdentifier: string;
  expiresAt: Date;
  createdAt: Date;
  compareRefreshToken(candidateToken: string): Promise<boolean>;
}
