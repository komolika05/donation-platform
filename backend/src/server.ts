import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";

// Import utilities
import connectDB from "./config/database";
import logger from "./utils/logger";
import { scheduleAnnualReceiptGeneration } from "./utils/cronJobs";

// Import routes
import authRoutes from "./routes/auth";
import donationRoutes from "./routes/donations";
import reportRoutes from "./routes/reports";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";
import receiptRoutes from "./routes/receipts";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env["PORT"];

// Connect to database
connectDB();

// Schedule cron jobs
scheduleAnnualReceiptGeneration();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env["FRONTEND_URL"] || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Request logging middleware
app.use((req, _unused, next) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });
  next();
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the JKVIS Backend 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (_unused, res) => {
  logger.info("Health check requested");
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env["NODE_ENV"] || "development",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/receipts", receiptRoutes);

// 404 handler
app.use("*", (req, res) => {
  logger.warn("Route not found", { url: req.originalUrl, method: req.method });
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response) => {
  logger.error("Unhandled error:", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env["NODE_ENV"] === "production"
        ? "Internal server error"
        : err.message,
    ...(process.env["NODE_ENV"] !== "production" && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    environment: process.env["NODE_ENV"] || "development",
    port: PORT,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;
