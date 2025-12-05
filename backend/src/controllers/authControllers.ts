import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import authService from "../services/authService";

// Register User
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fullName, email, password, profileImageUrl } = req.body || {};

  // Validation: Check for missing fields
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

    return res.status(201).json(result);
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
    return res.status(200).json(result);
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
