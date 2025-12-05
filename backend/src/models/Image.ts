import mongoose, { Document, Schema } from "mongoose";

export interface IImage extends Document {
  userId: mongoose.Types.ObjectId;
  s3Key: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  imageType?: "PROFILE" | "ITEM" | "GENERAL";
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    s3Key: { type: String, required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    imageType: { type: String, default: "general" },
  },
  { timestamps: true }
);

// Index for faster queries
ImageSchema.index({ userId: 1, imageType: 1 });

const Image = mongoose.model<IImage>("Image", ImageSchema);
export default Image;
