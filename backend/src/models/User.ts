import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import type { IUser } from "../types";
import log from "../utils/logger";

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [100, "Country cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["donor", "hospital-admin", "super-admin"],
        message: "Role must be either donor, hospital-admin, or super-admin",
      },
      default: "donor",
    },
    hospitalName: {
      type: String,
      trim: true,
      maxlength: [200, "Hospital name cannot exceed 200 characters"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

UserSchema.pre("validate", function (next) {
  if (this["role"] === "hospital-admin" && !this["hospitalName"]) {
    this.invalidate(
      "hospitalName",
      "Hospital name is required for hospital-admin role"
    );
  }
  next();
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    log("INFO", "Hashing password for user", { email: this["email"] });
    const salt = await bcrypt.genSalt(12);
    this["password"] = await bcrypt.hash(this["password"] as string, salt);
    next();
  } catch (error) {
    log("ERROR", "Error hashing password:", error);
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods["comparePassword"] = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    log("INFO", "Comparing password for user", { email: this["email"] });
    return await bcrypt.compare(candidatePassword, this["password"]);
  } catch (error) {
    log("ERROR", "Error comparing password:", error);
    return false;
  }
};

// Remove password from JSON output
UserSchema.methods["toJSON"] = function () {
  const userObject = this["toObject"]();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<IUser>("User", UserSchema);
