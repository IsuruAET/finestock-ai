import { IUser } from "./models";

// Auth Request Types
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

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

