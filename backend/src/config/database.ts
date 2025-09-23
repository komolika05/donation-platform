import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env["MONGODB_URI"] || "mongodb://localhost:27017/jkvis_platform";

    logger.info("Attempting to connect to MongoDB...", {
      uri: mongoURI.replace(/\/\/.*@/, "//***:***@"),
    });

    const conn = await mongoose.connect(mongoURI, {
      dbName: process.env["DB_NAME"] || "jkvis_platform",
    });

    logger.info("MongoDB Connected Successfully", {
      host: conn.connection.host,
      database: conn.connection.name,
      port: conn.connection.port,
    });

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
