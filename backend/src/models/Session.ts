import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ISession } from "../types/models";

const TOKEN_IDENTIFIER_SECRET =
  process.env.TOKEN_IDENTIFIER_SECRET || process.env.JWT_SECRET || "";

const SessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshToken: { type: String, required: true },
    tokenIdentifier: {
      type: String,
      required: false, // Auto-generated in pre-save hook
      unique: true,
      index: true,
    },
    previousTokenHash: { type: String, required: false },
    previousTokenIdentifier: { type: String, required: false },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

// Hash refresh token before saving and generate HMAC identifier
SessionSchema.pre<ISession>("save", async function () {
  if (this.isModified("refreshToken")) {
    // refreshToken currently holds the new plain token; tokenIdentifier will reflect it
    const plainToken = this.refreshToken;
    this.tokenIdentifier = crypto
      .createHmac("sha256", TOKEN_IDENTIFIER_SECRET)
      .update(plainToken)
      .digest("hex");
    this.refreshToken = await bcrypt.hash(plainToken, 10);
  } else if (!this.tokenIdentifier || this.isNew) {
    // Ensure identifier exists even if refreshToken wasn't marked modified (safety)
    const plainToken = this.refreshToken;
    this.tokenIdentifier = crypto
      .createHmac("sha256", TOKEN_IDENTIFIER_SECRET)
      .update(plainToken)
      .digest("hex");
  }
});

// Compare refresh tokens
SessionSchema.methods.compareRefreshToken = async function (
  candidateToken: string
): Promise<boolean> {
  return bcrypt.compare(candidateToken, this.refreshToken);
};

// Compare previous refresh token (for reuse detection)
SessionSchema.methods.comparePreviousRefreshToken = async function (
  candidateToken: string
): Promise<boolean> {
  if (!this.previousTokenHash) return false;
  return bcrypt.compare(candidateToken, this.previousTokenHash);
};

const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;
export { ISession }; // Re-export for backward compatibility
