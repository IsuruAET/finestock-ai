import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository";
import { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

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
  token: string;
}

export class AuthService {
  private generateToken(id: string): string {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Create the user
    const user = await userRepository.create(data);

    // Remove password from user object
    const { password: rPassword, ...userWithoutPassword } = user.toObject();

    return {
      id: String(user._id),
      user: userWithoutPassword,
      token: this.generateToken(String(user._id)),
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await user.comparePassword(data.password))) {
      throw new Error("Invalid Credentials");
    }

    // Remove password from user object
    const { password: rPassword, ...userWithoutPassword } = user.toObject();

    return {
      id: String(user._id),
      user: userWithoutPassword,
      token: this.generateToken(String(user._id)),
    };
  }

  async getUserInfo(userId: string): Promise<IUser | null> {
    return await userRepository.findById(userId);
  }
}

export default new AuthService();

