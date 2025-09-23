import express, { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import User from "../models/User";
import { authenticate } from "../middleware/auth";
import {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
} from "../utils/validation";
import logger from "../utils/logger";
import type { AuthRequest } from "../middleware/auth";

const router = express.Router();

// JWT helpers
const JWT_SECRET: string = process.env["JWT_SECRET"]!;
const JWT_EXPIRES_IN: string = process.env["JWT_EXPIRES_IN"] || "7d";

// Generate JWT token
const generateToken = (userId: string): string => {
  const payload = { userId };
  const secret: Secret = JWT_SECRET;

  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };

  return jwt.sign(payload, secret, options);
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  validateRegistration,
  async (req: Request, res: Response) => {
    try {
      const { name, email, password, address, country, role } = req.body;

      logger.info("User registration attempt", {
        email,
        role: role || "donor",
      });

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn("Registration failed: User already exists", { email });
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      const user = new User({
        name,
        email,
        password,
        address,
        country,
        role: role || "donor",
      });
      await user.save();

      const token = generateToken(user._id!.toString());

      logger.info("User registered successfully", {
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
          token,
        },
      });
    } catch (error: unknown) {
      logger.error("Registration error:", error as Error);
      return res.status(500).json({
        success: false,
        message:
          (error as Error)?.message || "Server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    logger.info("User login attempt", { email });

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.warn("Login failed: User not found", { email });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn("Login failed: Invalid password", { email });
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id!.toString());

    logger.info("User logged in successfully", {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        token,
      },
    });
  } catch (error: unknown) {
    logger.error("Login error:", error as Error);
    return res.status(500).json({
      success: false,
      message: (error as Error)?.message || "Server error during login",
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    logger.info("Profile requested", { userId: user._id });

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          country: user.country,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: unknown) {
    logger.error("Profile fetch error:", error as Error);
    return res.status(500).json({
      success: false,
      message: (error as Error)?.message || "Server error fetching profile",
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, address, country } = req.body;
      const user = req.user!;

      logger.info("Profile update attempt", { userId: user._id });

      if (name) user.name = name;
      if (address !== undefined) user.address = address;
      if (country !== undefined) user.country = country;

      await user.save();

      logger.info("Profile updated successfully", { userId: user._id });

      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            country: user.country,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
        },
      });
    } catch (error: unknown) {
      logger.error("Profile update error:", error as Error);
      return res.status(500).json({
        success: false,
        message: (error as Error)?.message || "Server error updating profile",
      });
    }
  }
);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  authenticate,
  validatePasswordChange,
  async (req: AuthRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user!._id).select("+password");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      logger.info("Password change attempt", { userId: user._id });

      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        logger.warn("Password change failed: Invalid current password", {
          userId: user._id,
        });
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }

      user.password = newPassword;
      await user.save();

      logger.info("Password changed successfully", { userId: user._id });

      return res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: unknown) {
      logger.error("Password change error:", error as Error);
      return res.status(500).json({
        success: false,
        message: (error as Error)?.message || "Server error changing password",
      });
    }
  }
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", authenticate, (req: AuthRequest, res: Response) => {
  logger.info("User logged out", { userId: req.user!._id });
  return res.json({ success: true, message: "Logged out successfully" });
});

export default router;
