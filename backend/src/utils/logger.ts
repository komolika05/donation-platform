import winston from "winston";
import path from "path";

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, "../../logs");

type LogLevel =
  | "INFO"
  | "DEBUG"
  | "ERROR"
  | "WARN"
  | "CASE-REPORT"
  | "DONATION"
  | "MONGODB";

function c(c: string) {
  if (c === "ERROR") return "\x1b[31m";
  const colors = [
    "\x1b[32m",
    "\x1b[33m",
    "\x1b[34m",
    "\x1b[35m",
    "\x1b[36m",
    "\x1b[37m",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getISTTimestamp() {
  const date = new Date();
  // Convert to IST (UTC + 5:30)
  const istOffset = 5.5 * 60; // in minutes
  const istTime = new Date(date.getTime() + istOffset * 60 * 1000);
  return istTime.toISOString().replace("T", " ").replace("Z", "");
}

// Base winston logger (kept as-is)
const baseLogger = winston.createLogger({
  level: process.env["LOG_LEVEL"] || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  defaultMeta: { service: "jkvis-server" },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env["NODE_ENV"] !== "production") {
  baseLogger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Our wrapper function
const log = (level: LogLevel, message: string, ...optionalParams: any[]) => {
  const timestamp = getISTTimestamp();
  // console output (colored)
  console.log(
    c(level),
    `[${level}] [${timestamp}] ${message}`,
    ...optionalParams
  );

  // forward to winston logger
  // map your custom levels to winston levels (info, debug, error, warn)
  const mapped =
    level === "ERROR"
      ? "error"
      : level === "DEBUG"
      ? "debug"
      : level === "WARN"
      ? "warn"
      : "info";

  baseLogger.log(mapped, message, optionalParams);
};

export default log;

// Optional global log like your second snippet
(global as any).log = log;
