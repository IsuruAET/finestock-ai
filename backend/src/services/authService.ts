import jwt from "jsonwebtoken";
import crypto from "crypto";
import mongoose from "mongoose";
import userRepository from "../repositories/userRepository";
import sessionRepository from "../repositories/sessionRepository";
import {
  IUser,
  RegisterData,
  LoginData,
  AuthResponse,
  RefreshTokenResponse,
} from "../types";

const JWT_SECRET: string = process.env.JWT_SECRET || "";
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY_DAYS || "7"
);

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

  private computeSessionExpiry(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
    return expiresAt;
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
    const { session, reused } = await sessionRepository.findByRefreshToken(
      refreshToken
    );

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await sessionRepository.deleteByRefreshToken(refreshToken);
      }
      throw new Error("Invalid or expired refresh token");
    }

    if (reused) {
      // Reuse detected: revoke this session entirely
      await sessionRepository.deleteByRefreshToken(refreshToken);
      throw new Error("Refresh token reuse detected");
    }

    // Token rotation with reuse detection: update same session
    const newRefreshToken = this.generateRefreshToken();
    const newExpiry = this.computeSessionExpiry();
    await sessionRepository.rotateSession(session, newRefreshToken, newExpiry);

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

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      businessName?: string | null;
      address?: string | null;
      phone?: string | null;
      profileImageUrl?: string | null;
    }
  ): Promise<IUser | null> {
    return await userRepository.update(userId, data);
  }
}

export default new AuthService();
