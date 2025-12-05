import jwt from "jsonwebtoken";
import crypto from "crypto";
import userRepository from "../repositories/userRepository";
import sessionRepository from "../repositories/sessionRepository";
import { IUser } from "../models/User";
import mongoose from "mongoose";

const JWT_SECRET: string = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY_DAYS || "7"
);

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  user: Omit<IUser, "password">;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string; // New refresh token if rotation is enabled
}

export class AuthService {
  private generateAccessToken(id: string): string {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    } as jwt.SignOptions);
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  private async createSession(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await sessionRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      refreshToken,
      expiresAt,
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const user = await userRepository.create(data);
    const { password: rPassword, ...userWithoutPassword } = user.toObject();

    const accessToken = this.generateAccessToken(String(user._id));
    const refreshToken = this.generateRefreshToken();
    await this.createSession(String(user._id), refreshToken);

    return {
      id: String(user._id),
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await user.comparePassword(data.password))) {
      throw new Error("Invalid Credentials");
    }

    // Delete old sessions for this user (optional: keep multiple sessions)
    // await sessionRepository.deleteByUserId(String(user._id));

    const { password: rPassword, ...userWithoutPassword } = user.toObject();

    const accessToken = this.generateAccessToken(String(user._id));
    const refreshToken = this.generateRefreshToken();
    await this.createSession(String(user._id), refreshToken);

    return {
      id: String(user._id),
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const session = await sessionRepository.findByRefreshToken(refreshToken);

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await sessionRepository.deleteByRefreshToken(refreshToken);
      }
      throw new Error("Invalid or expired refresh token");
    }

    // Token rotation: invalidate old token, issue new one
    await sessionRepository.deleteByRefreshToken(refreshToken);

    const newRefreshToken = this.generateRefreshToken();
    await this.createSession(String(session.userId), newRefreshToken);

    const accessToken = this.generateAccessToken(String(session.userId));
    return {
      accessToken,
      refreshToken: newRefreshToken, // Client must update cookie
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await sessionRepository.deleteByRefreshToken(refreshToken);
  }

  async getUserInfo(userId: string): Promise<IUser | null> {
    return await userRepository.findById(userId);
  }
}

export default new AuthService();
