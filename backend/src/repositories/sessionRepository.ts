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

  async findByRefreshToken(
    refreshToken: string
  ): Promise<{ session: ISession | null; reused: boolean }> {
    // Generate HMAC identifier for fast lookup
    const tokenIdentifier = crypto
      .createHmac("sha256", TOKEN_IDENTIFIER_SECRET)
      .update(refreshToken)
      .digest("hex");

    // Try current or previous identifier to detect reuse
    const session = await Session.findOne({
      $or: [{ tokenIdentifier }, { previousTokenIdentifier: tokenIdentifier }],
    });

    if (!session) return { session: null, reused: false };

    const isCurrent = await session.compareRefreshToken(refreshToken);
    if (isCurrent) return { session, reused: false };

    const isPrevious = await session.comparePreviousRefreshToken(refreshToken);
    if (isPrevious) return { session, reused: true };

    return { session: null, reused: false };
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    // Find session first to get the ID, then delete
    const { session } = await this.findByRefreshToken(refreshToken);
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

  async rotateSession(
    session: ISession,
    newRefreshToken: string,
    expiresAt: Date
  ): Promise<ISession> {
    // Preserve previous token hash and identifier to detect reuse
    session.previousTokenHash = session.refreshToken;
    session.previousTokenIdentifier = session.tokenIdentifier;
    session.refreshToken = newRefreshToken;
    session.expiresAt = expiresAt;
    // Explicitly mark as modified to ensure pre-save hook runs
    session.markModified("refreshToken");
    return session.save();
  }
}

export default new SessionRepository();
