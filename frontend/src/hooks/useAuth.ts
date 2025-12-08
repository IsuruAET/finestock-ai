import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { LoginFormData, RegisterFormData } from "../schemas/authSchemas";
import axios from "axios";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImageUrl?: string;
}

interface AuthResponse {
  id: string;
  user: User;
  token: string;
}

interface AuthError {
  message: string;
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AuthError, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const response = await axiosInstance.post<AuthResponse>(
        API_PATHS.AUTH.LOGIN,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("token", data.token);

      // Set user data in query cache to prevent refetching
      queryClient.setQueryData(["user"], data.user);

      // Invalidate and refetch user-related queries if needed
      // But we set the data above, so it won't refetch unnecessarily
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw {
          message:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        };
      }
      throw { message: "Something went wrong. Please try again." };
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AuthError, RegisterFormData>({
    mutationFn: async (data: RegisterFormData) => {
      const response = await axiosInstance.post<AuthResponse>(
        API_PATHS.AUTH.REGISTER,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("token", data.token);

      // Set user data in query cache to prevent refetching
      queryClient.setQueryData(["user"], data.user);

      // Invalidate and refetch user-related queries if needed
      // But we set the data above, so it won't refetch unnecessarily
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        throw {
          message:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
        };
      }
      throw { message: "Something went wrong. Please try again." };
    },
  });
};

// Get user info query
export const useGetUserInfo = () => {
  const token = localStorage.getItem("token");

  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get<User>(
        API_PATHS.AUTH.GET_USER_INFO
      );
      return response.data;
    },
    enabled: !!token, // Only run if token exists
    retry: false, // Don't retry on failure (will handle redirect)
    staleTime: Infinity, // Consider data fresh forever (until manual invalidation)
  });
};
