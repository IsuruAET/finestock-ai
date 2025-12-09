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
  useRefreshTokenMutation,
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} from "../api/services/auth-service";
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
  const [profileEnabled, setProfileEnabled] = useState(false);

  // Use hooks from API builder
  const refreshTokenMutation = useRefreshTokenMutation();
  const profileQuery = useGetProfileQuery({ enabled: profileEnabled });
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const result = await refreshTokenMutation.mutateAsync();
      setAccessToken(result.accessToken);
      setAuthHeader(result.accessToken);
      setError(null);
      setProfileEnabled(true); // Enable profile query after token refresh
      return result.accessToken;
    } catch {
      setAccessToken(null);
      setUser(null);
      setProfileEnabled(false);
      clearAuthHeader();
      setError({ message: "Unable to refresh session" });
      return null;
    }
  }, [refreshTokenMutation]);

  const checkAuthStatus = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const token = await refreshToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return null;
      }
      // Wait for profile query to complete
      if (profileQuery.data) {
        setUser(profileQuery.data);
        setError(null);
        setIsLoading(false);
        return profileQuery.data;
      }
      // If no data yet, wait a bit and refetch
      const profileData = await profileQuery.refetch();
      if (profileData.data) {
        setUser(profileData.data);
        setError(null);
        setIsLoading(false);
        return profileData.data;
      }
      setIsLoading(false);
      return null;
    } catch {
      setUser(null);
      setError({ message: "Authentication check failed" });
      setIsLoading(false);
      return null;
    }
  }, [refreshToken, profileQuery]);

  // Sync profile query data with user state
  useEffect(() => {
    if (profileQuery.data) {
      setUser(profileQuery.data);
    } else if (profileQuery.error) {
      setError({ message: "Failed to fetch profile" });
    }
  }, [profileQuery.data, profileQuery.error]);

  const login = useCallback(
    async (data: LoginFormData): Promise<AuthResponse> => {
      try {
        const authData = await loginMutation.mutateAsync(data);
        setAccessToken(authData.accessToken);
        setAuthHeader(authData.accessToken);
        setUser(authData.user);
        setProfileEnabled(true);
        setError(null);
        return authData;
      } catch (err) {
        const authError: AuthError = {
          message: err instanceof Error ? err.message : "Login failed",
        };
        setError(authError);
        throw err;
      }
    },
    [loginMutation]
  );

  const register = useCallback(
    async (data: RegisterFormData): Promise<AuthResponse> => {
      try {
        const authData = await registerMutation.mutateAsync(data);
        setAccessToken(authData.accessToken);
        setAuthHeader(authData.accessToken);
        setUser(authData.user);
        setProfileEnabled(true);
        setError(null);
        return authData;
      } catch (err) {
        const authError: AuthError = {
          message: err instanceof Error ? err.message : "Registration failed",
        };
        setError(authError);
        throw err;
      }
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (logoutError) {
      // Proceed with client cleanup even if server logout fails
      console.error("Logout error:", logoutError);
    } finally {
      setAccessToken(null);
      setUser(null);
      setProfileEnabled(false);
      clearAuthHeader();
      setError(null);
      if (window.location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    }
  }, [navigate, logoutMutation]);

  const updateUser = useCallback(
    async (data: UpdateProfileFormData): Promise<User> => {
      try {
        const updated = await updateProfileMutation.mutateAsync(data);
        setUser(updated);
        return updated;
      } catch (err) {
        const authError: AuthError = {
          message: err instanceof Error ? err.message : "Update failed",
        };
        setError(authError);
        throw err;
      }
    },
    [updateProfileMutation]
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
