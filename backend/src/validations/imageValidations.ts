import { z } from "zod";
import { mongoIdSchema } from "./authValidations";

// Image validation schemas
export const imageTypeSchema = z.enum(["GENERAL", "PROFILE", "DOCUMENT"], {
  message: "Image type must be GENERAL, PROFILE, or DOCUMENT",
});

export const uploadImageSchema = z.object({
  body: z.object({
    imageType: imageTypeSchema.optional().default("GENERAL"),
  }),
});

export const deleteImageSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }),
});

// Type exports for TypeScript inference
export type UploadImageInput = z.infer<typeof uploadImageSchema>["body"];
export type DeleteImageParams = z.infer<typeof deleteImageSchema>["params"];

