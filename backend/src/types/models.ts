import { Document } from "mongoose";
import mongoose from "mongoose";

// Image Type Enum (shared between validation, models, and services)
export type ImageType = "GENERAL" | "PROFILE" | "DOCUMENT";

// User Model
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  businessName?: string | null;
  address?: string | null;
  phone?: string | null;
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
  previousTokenHash?: string | null;
  previousTokenIdentifier?: string | null;
  expiresAt: Date;
  createdAt: Date;
  compareRefreshToken(candidateToken: string): Promise<boolean>;
  comparePreviousRefreshToken(candidateToken: string): Promise<boolean>;
}

// Purchase Order Model
export interface IPurchaseOrderItem {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxPercent?: number;
  total: number;
}

export interface IPurchaseOrder extends Document {
  user: mongoose.Types.ObjectId;
  poNumber: string;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  vendor?: {
    companyName?: string;
    contactName?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  shipTo?: {
    companyName?: string;
    contactName?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  items: IPurchaseOrderItem[];
  notes?: string;
  paymentTerms?: string;
  status:
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "ORDERED"
    | "RECEIVED"
    | "CANCELLED";
  subtotal: number;
  totalTax: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
