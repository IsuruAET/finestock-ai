import { finestockApi } from "../finestockApi";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import type { AuthResponse, User } from "../../types/auth";
import type {
  LoginFormData,
  RegisterFormData,
  UpdateProfileFormData,
} from "../../schemas/authSchemas";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

const endpoints = finestockApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    refreshToken: build.mutation<{ accessToken: string }, void>({
      mutationKey: ["auth", "refreshToken"],
      mutationFn: async () => {
        const response = await axiosInstance.post<{ accessToken: string }>(
          API_PATHS.AUTH.REFRESH_TOKEN,
          {}
        );
        return response.data;
      },
      invalidatesTags: () => ["Auth"],
    }),

    getProfile: build.query<User, { enabled?: boolean }>({
      queryKey: () => ["auth", "profile"],
      queryFn: async () => {
        const response = await axiosInstance.get<User>(
          API_PATHS.AUTH.GET_PROFILE
        );
        return response.data;
      },
      enabled: (params) => params?.enabled !== false,
      providesTags: () => ["AuthProfile"],
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),

    login: build.mutation<AuthResponse, LoginFormData>({
      mutationKey: ["auth", "login"],
      mutationFn: async (data) => {
        const response = await axiosInstance.post<AuthResponse>(
          API_PATHS.AUTH.LOGIN,
          data
        );
        return response.data;
      },
      invalidatesTags: () => ["Auth", "AuthProfile"],
      onSuccess: (result, _variables, queryClient) => {
        // Update profile cache immediately
        queryClient.setQueryData(["auth", "profile"], result.user);
      },
    }),

    register: build.mutation<AuthResponse, RegisterFormData>({
      mutationKey: ["auth", "register"],
      mutationFn: async (data) => {
        const response = await axiosInstance.post<AuthResponse>(
          API_PATHS.AUTH.REGISTER,
          data
        );
        return response.data;
      },
      invalidatesTags: () => ["Auth", "AuthProfile"],
      onSuccess: (result, _variables, queryClient) => {
        // Update profile cache immediately
        queryClient.setQueryData(["auth", "profile"], result.user);
      },
    }),

    logout: build.mutation<void, void>({
      mutationKey: ["auth", "logout"],
      mutationFn: async () => {
        await axiosInstance.post(API_PATHS.AUTH.LOGOUT, {});
      },
      invalidatesTags: () => ["Auth", "AuthProfile"],
      onSuccess: (_result, _variables, queryClient) => {
        // Clear all auth-related queries
        queryClient.removeQueries({ queryKey: ["auth"] });
      },
    }),

    updateProfile: build.mutation<User, UpdateProfileFormData>({
      mutationKey: ["auth", "updateProfile"],
      mutationFn: async (data) => {
        const response = await axiosInstance.put<User>(
          API_PATHS.AUTH.UPDATE_PROFILE,
          data
        );
        return response.data;
      },
      invalidatesTags: () => ["AuthProfile"],
      onSuccess: (result, _variables, queryClient) => {
        // Update profile cache immediately
        queryClient.setQueryData(["auth", "profile"], result);
      },
    }),
  }),
});

// Type the endpoints properly
type AuthEndpoints = {
  refreshToken: {
    useMutation: () => UseMutationResult<
      { accessToken: string },
      unknown,
      void
    >;
  };
  getProfile: {
    useQuery: (params?: { enabled?: boolean }) => UseQueryResult<User>;
  };
  login: {
    useMutation: () => UseMutationResult<AuthResponse, unknown, LoginFormData>;
  };
  register: {
    useMutation: () => UseMutationResult<
      AuthResponse,
      unknown,
      RegisterFormData
    >;
  };
  logout: { useMutation: () => UseMutationResult<void, unknown, void> };
  updateProfile: {
    useMutation: () => UseMutationResult<User, unknown, UpdateProfileFormData>;
  };
};

// Export hooks with RTK Query-like naming convention
export const useRefreshTokenMutation = () =>
  (endpoints.refreshToken as AuthEndpoints["refreshToken"]).useMutation();
export const useGetProfileQuery = (params?: { enabled?: boolean }) =>
  (endpoints.getProfile as AuthEndpoints["getProfile"]).useQuery(params);
export const useLoginMutation = () =>
  (endpoints.login as AuthEndpoints["login"]).useMutation();
export const useRegisterMutation = () =>
  (endpoints.register as AuthEndpoints["register"]).useMutation();
export const useLogoutMutation = () =>
  (endpoints.logout as AuthEndpoints["logout"]).useMutation();
export const useUpdateProfileMutation = () =>
  (endpoints.updateProfile as AuthEndpoints["updateProfile"]).useMutation();
