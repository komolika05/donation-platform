import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import type { IUser } from "../types";
import logger from "../utils/logger";

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

// JWT Authentication middleware
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      logger.warn("Authentication failed: No token provided", { ip: req.ip });
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env["JWT_SECRET"]!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId).select("+password");

    if (!user) {
      logger.warn("Authentication failed: User not found", {
        userId: decoded.userId,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    req.user = user;
    logger.info("User authenticated successfully", {
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
    return;
  }

  return next();
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.error("Authorization failed: No user in request");
      return res.status(401).json({
        success: false,
        message: "Access denied. Please authenticate first.",
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn("Authorization failed: Insufficient permissions", {
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
      });
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    logger.info("User authorized successfully", {
      userId: req.user._id,
      role: req.user.role,
      requiredRoles: roles,
    });

    return next();
  };
};

// Optional authentication (for routes that work with or without auth)
export const optionalAuth = async (req: AuthRequest, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env["JWT_SECRET"]!) as {
        userId: string;
      };
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        logger.info("Optional auth: User authenticated", { userId: user._id });
      }
    }

    next();
  } catch (error) {
    logger.warn("Optional auth failed, continuing without user:", error);
    next();
  }
};
