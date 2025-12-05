import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import authService from "../services/authService";

const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/",
  });
};

const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
};

// Register User
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fullName, email, password, profileImageUrl } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await authService.register({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    setRefreshTokenCookie(res, result.refreshToken);

    const { refreshToken, ...responseData } = result;
    return res.status(201).json(responseData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const statusCode = error.message === "Email already in use" ? 400 : 500;
      return res.status(statusCode).json({
        message: "Error registering user",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// Login User
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await authService.login({ email, password });

    setRefreshTokenCookie(res, result.refreshToken);

    const { refreshToken, ...responseData } = result;
    return res.status(200).json(responseData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const statusCode = error.message === "Invalid Credentials" ? 400 : 500;
      return res.status(statusCode).json({
        message: "Error login user",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// Refresh Access Token
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  try {
    const result = await authService.refreshAccessToken(refreshToken);
    return res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      clearRefreshTokenCookie(res);
      const statusCode = error.message.includes("Invalid") ? 401 : 500;
      return res.status(statusCode).json({
        message: "Error refreshing token",
        error: error.message,
      });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};

// Logout User
export const logoutUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    try {
      await authService.logout(refreshToken);
    } catch (error) {
      // Continue even if logout fails
    }
  }

  clearRefreshTokenCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
};

// Get User Information
export const getUserInfo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authService.getUserInfo(String(req.user._id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error fetching user info", error: error.message });
    }
    return res.status(500).json({ message: "Unknown error occurred" });
  }
};
