import { z } from "zod";

// Validation Target Type
export type ValidationTarget = "body" | "query" | "params";

// Auth Validation Types (inferred from Zod schemas - single source of truth)
export type RegisterInput = z.infer<
  typeof import("../validations/authValidations").registerSchema
>["body"];
export type LoginInput = z.infer<
  typeof import("../validations/authValidations").loginSchema
>["body"];

// Image Validation Types (inferred from Zod schemas)
export type UploadImageInput = z.infer<
  typeof import("../validations/imageValidations").uploadImageSchema
>["body"];
export type DeleteImageParams = z.infer<
  typeof import("../validations/imageValidations").deleteImageSchema
>["params"];
