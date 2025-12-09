import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import {
  fetchProfileRequest,
  loginRequest,
  logoutRequest,
  refreshTokenRequest,
  registerRequest,
  updateProfileRequest,
} from "../hooks/useAuth";
import axiosInstance from "../utils/axioInstance";
import type { AuthError, AuthResponse, User } from "../types/auth";
import type {
  LoginFormData,
  RegisterFormData,
  UpdateProfileFormData,
} from "../schemas/authSchemas";

interface AuthProviderProps {
  children: ReactNode;
}

const clearAuthHeader = () => {
  delete axiosInstance.defaults.headers.common.Authorization;
};

const setAuthHeader = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    clearAuthHeader();
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const newToken = await refreshTokenRequest();
      setAccessToken(newToken);
      setAuthHeader(newToken);
      setError(null);
      return newToken;
    } catch {
      setAccessToken(null);
      setUser(null);
      clearAuthHeader();
      setError({ message: "Unable to refresh session" });
      return null;
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    const profile = await fetchProfileRequest();
    return profile;
  }, []);

  const checkAuthStatus = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const token = await refreshToken();
      if (!token) {
        setUser(null);
        return null;
      }
      const profile = await fetchProfile();
      setUser(profile);
      setError(null);
      return profile;
    } catch {
      setUser(null);
      setError({ message: "Authentication check failed" });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, refreshToken]);

  const login = useCallback(
    async (data: LoginFormData): Promise<AuthResponse> => {
      const authData = await loginRequest(data);
      setAccessToken(authData.accessToken);
      setAuthHeader(authData.accessToken);
      setUser(authData.user);
      setError(null);
      return authData;
    },
    []
  );

  const register = useCallback(
    async (data: RegisterFormData): Promise<AuthResponse> => {
      const authData = await registerRequest(data);
      setAccessToken(authData.accessToken);
      setAuthHeader(authData.accessToken);
      setUser(authData.user);
      setError(null);
      return authData;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (logoutError) {
      // Proceed with client cleanup even if server logout fails
      console.error("Logout error:", logoutError);
    } finally {
      setAccessToken(null);
      setUser(null);
      clearAuthHeader();
      setError(null);
      if (window.location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const updateUser = useCallback(
    async (data: UpdateProfileFormData): Promise<User> => {
      const updated = await updateProfileRequest(data);
      setUser(updated);
      return updated;
    },
    []
  );

  useEffect(() => {
    // Hydrate auth state on first render
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    // Keep axios default header in sync with the access token
    setAuthHeader(accessToken);
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      loading: isLoading,
      isAuthenticated: !!user,
      error,
      login,
      register,
      logout,
      refreshToken,
      updateUser,
      checkAuthStatus,
    }),
    [
      user,
      isLoading,
      error,
      login,
      register,
      logout,
      refreshToken,
      updateUser,
      checkAuthStatus,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
