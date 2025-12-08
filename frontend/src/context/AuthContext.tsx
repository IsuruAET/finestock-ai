import { createContext, useContext } from "react";
import type { User } from "../hooks/useAuth";

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  handleLogout: () => void;
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
