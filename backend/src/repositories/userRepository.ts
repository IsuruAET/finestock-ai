import User, { IUser } from "../models/User";

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select("-password");
  }

  async create(userData: {
    fullName: string;
    email: string;
    password: string;
    profileImageUrl?: string | null;
  }): Promise<IUser> {
    return await User.create(userData);
  }

  async exists(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }
}

export default new UserRepository();

