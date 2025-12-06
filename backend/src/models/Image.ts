import mongoose, { Schema } from "mongoose";
import { IImage } from "../types/models";

const ImageSchema = new Schema<IImage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    s3Key: { type: String, required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    imageType: {
      type: String,
      enum: ["GENERAL", "PROFILE", "DOCUMENT"],
      default: "GENERAL",
    },
  },
  { timestamps: true }
);

// Index for faster queries
ImageSchema.index({ userId: 1, imageType: 1 });

const Image = mongoose.model<IImage>("Image", ImageSchema);
export default Image;
export { IImage }; // Re-export for backward compatibility
