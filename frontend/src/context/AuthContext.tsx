import { createContext, useContext } from "react";
import type { AuthError, AuthResponse, User } from "../types/auth";
import type {
  LoginFormData,
  RegisterFormData,
  UpdateProfileFormData,
} from "../schemas/authSchemas";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  login: (data: LoginFormData) => Promise<AuthResponse>;
  register: (data: RegisterFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  updateUser: (data: UpdateProfileFormData) => Promise<User>;
  checkAuthStatus: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
