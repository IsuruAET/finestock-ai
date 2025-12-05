import Session, { ISession } from "../models/Session";
import mongoose from "mongoose";
import crypto from "crypto";

const TOKEN_IDENTIFIER_SECRET =
  process.env.TOKEN_IDENTIFIER_SECRET || process.env.JWT_SECRET || "";

export class SessionRepository {
  async create(data: {
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
  }): Promise<ISession> {
    return await Session.create(data);
  }

  async findByRefreshToken(refreshToken: string): Promise<ISession | null> {
    // Generate HMAC identifier for fast lookup
    const tokenIdentifier = crypto
      .createHmac("sha256", TOKEN_IDENTIFIER_SECRET)
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({ tokenIdentifier });

    if (!session) return null;

    // Verify the full token matches (defense in depth)
    const isValid = await session.compareRefreshToken(refreshToken);
    return isValid ? session : null;
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    // Find session first to get the ID, then delete
    const session = await this.findByRefreshToken(refreshToken);
    if (session) {
      await Session.deleteOne({ _id: session._id });
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    await Session.deleteMany({ userId });
  }

  async deleteExpiredTokens(): Promise<void> {
    await Session.deleteMany({ expiresAt: { $lt: new Date() } });
  }
}

export default new SessionRepository();
