import { z } from "zod";
import { IUser } from "./models";
import { RegisterInput, LoginInput } from "./validation";

// Auth Request Types (using Zod-inferred types for single source of truth)
export type RegisterData = RegisterInput;
export type LoginData = LoginInput;

// Update Profile Types
export type UpdateProfileInput = z.infer<
  typeof import("../validations/authValidations").updateProfileSchema
>["body"];

// Auth Response Types
export interface AuthResponse {
  id: string;
  user: Omit<IUser, "password">;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; // New refresh token if rotation is enabled
}
