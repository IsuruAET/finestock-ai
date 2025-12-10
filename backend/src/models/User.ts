import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/models";

// Define schema
const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
      select: false,
    },
    businessName: { type: String, default: null },
    address: { type: String, default: null },
    phone: { type: String, default: null },
    profileImageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
export { IUser }; // Re-export for backward compatibility
