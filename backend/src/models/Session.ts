import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshToken: string; // Bcrypt hashed token stored here
  tokenIdentifier: string; // HMAC-SHA256 of token for fast lookup (indexed)
  expiresAt: Date;
  createdAt: Date;
  compareRefreshToken(candidateToken: string): Promise<boolean>;
}

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
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true }
);

// Hash refresh token before saving and generate HMAC identifier
SessionSchema.pre<ISession>("save", async function () {
  // Always generate tokenIdentifier if it doesn't exist or if refreshToken is modified
  if (this.isModified("refreshToken") || !this.tokenIdentifier || this.isNew) {
    const plainToken = this.refreshToken;
    // Generate HMAC-SHA256 identifier for fast, secure lookup
    this.tokenIdentifier = crypto
      .createHmac("sha256", TOKEN_IDENTIFIER_SECRET)
      .update(plainToken)
      .digest("hex");
    // Bcrypt hash for secure storage (prevents DB admin from reading tokens)
    this.refreshToken = await bcrypt.hash(plainToken, 10);
  }
});

// Compare refresh tokens
SessionSchema.methods.compareRefreshToken = async function (
  candidateToken: string
): Promise<boolean> {
  return bcrypt.compare(candidateToken, this.refreshToken);
};

const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;
