import { z } from "zod";
import mongoose from "mongoose";

// Common schemas
export const emailSchema = z.email("Invalid email format");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters");

export const fullNameSchema = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(100, "Full name must be less than 100 characters")
  .trim();

export const mongoIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), "Invalid ID format");

// Auth validation schemas
export const registerSchema = z.object({
  body: z.object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
  }).strict(),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  }).strict(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: fullNameSchema.optional(),
    profileImageUrl: z.url("Invalid URL format").optional().nullable(),
  }).strict(),
});
