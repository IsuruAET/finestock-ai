import { IUser } from "./models";
import { RegisterInput, LoginInput } from "./validation";

// Auth Request Types (using Zod-inferred types for single source of truth)
// Note: RegisterData omits undefined from optional properties for mongoose compatibility
export type RegisterData = Omit<RegisterInput, "profileImageUrl"> & {
  profileImageUrl?: string | null;
};
export type LoginData = LoginInput;

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
