import multer from "multer";
import log from "../utils/logger";

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    log("INFO", "File type accepted", {
      filename: file.originalname,
      mimetype: file.mimetype,
    });
    cb(null, true);
  } else {
    log("WARN", "File type rejected", {
      filename: file.originalname,
      mimetype: file.mimetype,
    });
    cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number.parseInt(process.env["MAX_FILE_SIZE"] || "5242880"), // 5MB default
    files: 1, // Only one file per upload
  },
});

// Error handling middleware for multer
export const handleUploadError = (
  error: any,
  _req: any,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    log("ERROR", "Multer upload error:", error);

    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum size is 5MB.",
        });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files. Only one file allowed.",
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: "Unexpected file field.",
        });
      default:
        return res.status(400).json({
          success: false,
          message: "File upload error.",
        });
    }
  } else if (error) {
    log("ERROR", "Upload error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed.",
    });
  }

  next();
};

export const uploadSingle = upload.single("photo");
