import { z } from "zod";
import { mongoIdSchema } from "./authValidations";

// Image validation schemas
export const imageTypeSchema = z.enum(["GENERAL", "PROFILE", "DOCUMENT"], {
  message: "Image type must be GENERAL, PROFILE, or DOCUMENT",
});

export const uploadImageSchema = z.object({
  body: z.object({
    imageType: imageTypeSchema.optional().default("GENERAL"),
  }).strict(),
});

export const deleteImageSchema = z.object({
  params: z.object({
    id: mongoIdSchema,
  }).strict(),
});
