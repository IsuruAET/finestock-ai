import Session, { ISession } from "../models/Session";
import mongoose from "mongoose";

export class SessionRepository {
  async create(data: {
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
  }): Promise<ISession> {
    return await Session.create(data);
  }

  async findByRefreshToken(refreshToken: string): Promise<ISession | null> {
    return await Session.findOne({ refreshToken });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await Session.deleteOne({ refreshToken });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await Session.deleteMany({ userId });
  }

  async deleteExpiredTokens(): Promise<void> {
    await Session.deleteMany({ expiresAt: { $lt: new Date() } });
  }
}

export default new SessionRepository();
