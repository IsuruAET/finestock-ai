export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    REFRESH_TOKEN: "/api/v1/auth/refresh-token",
    LOGOUT: "/api/v1/auth/logout",
    GET_PROFILE: "/api/v1/auth/me",
    UPDATE_PROFILE: "/api/v1/auth/me",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/images/upload",
    DELETE_IMAGE: "/api/v1/images/:id",
  },
};
