import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuthContext } from "../context/AuthContext";
import type { AuthError, AuthResponse, User } from "../types/auth";
import type {
  LoginFormData,
  RegisterFormData,
  UpdateProfileFormData,
} from "../schemas/authSchemas";

const AUTH_QUERY_KEYS = {
  profile: ["auth", "profile"] as const,
};

export const refreshTokenRequest = async (): Promise<string> => {
  const response = await axiosInstance.post<{ accessToken: string }>(
    API_PATHS.AUTH.REFRESH_TOKEN,
    {}
  );
  return response.data.accessToken;
};

export const fetchProfileRequest = async (): Promise<User> => {
  const response = await axiosInstance.get<User>(API_PATHS.AUTH.GET_PROFILE);
  return response.data;
};

export const loginRequest = async (
  data: LoginFormData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_PATHS.AUTH.LOGIN,
    data
  );
  return response.data;
};

export const registerRequest = async (
  data: RegisterFormData
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    API_PATHS.AUTH.REGISTER,
    data
  );
  return response.data;
};

export const logoutRequest = async () => {
  await axiosInstance.post(API_PATHS.AUTH.LOGOUT, {});
};

export const updateProfileRequest = async (
  data: UpdateProfileFormData
): Promise<User> => {
  const response = await axiosInstance.put<User>(
    API_PATHS.AUTH.UPDATE_PROFILE,
    data
  );
  return response.data;
};

export const useAuth = () => useAuthContext();

export const useLogin = () => {
  const { login } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AuthError, LoginFormData>({
    mutationKey: ["auth", "login"],
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
    },
  });
};

export const useRegister = () => {
  const { register } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AuthError, RegisterFormData>({
    mutationKey: ["auth", "register"],
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation<void, AuthError>({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
  });
};

export const useGetProfile = () => {
  const { user, isLoading, error, checkAuthStatus } = useAuthContext();

  const profileQuery = useQuery<User | null, AuthError>({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: checkAuthStatus,
    initialData: user ?? undefined,
    enabled: true,
  });

  return {
    data: profileQuery.data ?? undefined,
    isLoading: isLoading || profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    error: error ?? profileQuery.error ?? null,
    refetch: profileQuery.refetch,
  };
};

export const useUpdateProfile = () => {
  const { updateUser } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation<User, AuthError, UpdateProfileFormData>({
    mutationKey: ["auth", "updateProfile"],
    mutationFn: updateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, updatedUser);
    },
  });
};
