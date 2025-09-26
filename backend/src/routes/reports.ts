import express, { Response } from "express";
import fs from "fs";
import CaseReport from "../models/CaseReport";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth";
import { uploadSingle, handleUploadError } from "../middleware/upload";
import { body, validationResult } from "express-validator";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import log from "../utils/logger";

const router = express.Router();

// Validation middleware
const validateCaseReport = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("cost")
    .isFloat({ min: 1, max: 100000 })
    .withMessage("Cost must be between $1 and $100,000"),
  body("fundType")
    .isIn(["sponsorship", "20kids20"])
    .withMessage("Fund type must be either sponsorship or 20kids20"),
];

// -------------------- Upload Case Report --------------------
router.post(
  "/upload",
  authenticate,
  authorize("hospital-admin"),
  uploadSingle,
  handleUploadError,
  validateCaseReport,
  async (req: AuthRequest, res: Response): Promise<void> => {
    log("DEBUG", "Reaching /upload endpoint");
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        log("ERROR", "Validation failed", errors.array());
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      if (!req.file) {
        log("ERROR", "Missing Image File");
        res.status(400).json({ success: false, message: "Photo is required" });
        return;
      }

      const { title, description, cost, fundType } = req.body;
      const userId = String(req.user!._id);

      log("DEBUG", "Request body parsed", {
        title,
        cost,
        fundType,
        userId,
        fileName: req.file.originalname,
      });

      // Wrap the stream upload in a Promise to use async/await
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "case-reports",
            tags: ["case-report", userId],
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error("Cloudinary upload failed"));
            }
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
      });

      const result = await uploadPromise;
      if (!result || typeof result === "string") {
        // Type guard
        log("ERROR", "Cloudinary upload returned unexpected result", {
          result,
        });
        res.status(500).json({
          success: false,
          message:
            "Failed to upload photo to Cloudinary due to an internal error.",
        });
        return;
      }

      log("DEBUG", "Photo uploaded to Cloudinary", {
        secureUrl: (result as { secure_url: string }).secure_url,
        publicId: (result as { public_id: string }).public_id,
      });

      const photoUrl = (result as { secure_url: string }).secure_url;

      const caseReport = new CaseReport({
        title,
        description,
        cost: parseFloat(cost),
        fundType,
        photoUrl,
        HospitalId: userId,
      });

      await caseReport.save();
      log("DEBUG", "Case report saved to DB", { id: caseReport._id });

      res.status(201).json({
        success: true,
        message: "Case report uploaded successfully",
        data: {
          caseReport: {
            id: caseReport._id,
            title: caseReport.title,
            description: caseReport.description,
            cost: caseReport.cost,
            fundType: caseReport.fundType,
            photoUrl: caseReport.photoUrl,
            status: caseReport.status,
            createdAt: caseReport.createdAt,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Unhandled error in /upload", error);
      res.status(500).json({
        success: false,
        message: "Server error processing request",
      });
    }
  }
);

// -------------------- Get Pending Reports --------------------
router.get(
  "/pending",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = parseInt(req.query["limit"] as string) || 10;
      const skip = (page - 1) * limit;

      const pendingReports = await CaseReport.find({ status: "pending" })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPending = await CaseReport.countDocuments({
        status: "pending",
      });
      const totalPages = Math.ceil(totalPending / limit);

      res.json({
        success: true,
        data: {
          reports: pendingReports,
          pagination: {
            currentPage: page,
            totalPages,
            totalReports: totalPending,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error fetching pending reports",
      });
    }
  }
);

// -------------------- Review Case Report --------------------
router.put(
  "/review/:id",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { action, reviewNotes } = req.body;

      if (!["approve", "reject"].includes(action)) {
        res.status(400).json({
          success: false,
          message: "Action must be either 'approve' or 'reject'",
        });
        return;
      }

      const caseReport = await CaseReport.findById(id).populate(
        "uploadedBy",
        "name email"
      );
      if (!caseReport) {
        res
          .status(404)
          .json({ success: false, message: "Case report not found" });
        return;
      }

      if (caseReport.status !== "pending") {
        res.status(400).json({
          success: false,
          message: "Case report has already been reviewed",
        });
        return;
      }

      caseReport.status = action === "approve" ? "approved" : "rejected";
      if (reviewNotes) caseReport.set("reviewNotes", reviewNotes);

      await caseReport.save();

      res.json({
        success: true,
        message: `Case report ${action}d successfully`,
        data: { caseReport },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error reviewing case report",
      });
    }
  }
);

// -------------------- Get My Reports (Hospital Admin) --------------------
router.get(
  "/my-reports",
  authenticate,
  authorize("hospital-admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = String(req.user!._id);
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = parseInt(req.query["limit"] as string) || 10;
      const skip = (page - 1) * limit;
      const status = req.query["status"] as string;

      const query: any = { uploadedBy: userId };
      if (
        status &&
        ["pending", "approved", "rejected", "assigned"].includes(status)
      )
        query.status = status;

      const reports = await CaseReport.find(query)
        .populate("donor", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalReports = await CaseReport.countDocuments(query);
      const totalPages = Math.ceil(totalReports / limit);

      const statusCounts = await CaseReport.aggregate([
        { $match: { uploadedBy: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const statusSummary = statusCounts.reduce(
        (acc: any, item: any) => ({ ...acc, [item._id]: item.count }),
        {}
      );

      res.json({
        success: true,
        data: {
          reports,
          pagination: {
            currentPage: page,
            totalPages,
            totalReports,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          statusSummary,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error fetching reports" });
    }
  }
);

// -------------------- Get Case Report by ID --------------------
router.get(
  "/:id",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = String(req.user!._id);
      const userRole = req.user!.role;

      const caseReport = await CaseReport.findById(id)
        .populate("uploadedBy", "name email")
        .populate("donor", "name email");
      if (!caseReport) {
        res
          .status(404)
          .json({ success: false, message: "Case report not found" });
        return;
      }

      const uploadedById =
        typeof caseReport.uploadedBy === "object" &&
        caseReport.uploadedBy !== null
          ? (caseReport.uploadedBy as any)._id.toString()
          : caseReport.uploadedBy?.toString();
      const donorId =
        caseReport.donor && typeof caseReport.donor === "object"
          ? (caseReport.donor as any)._id.toString()
          : caseReport.donor?.toString();

      const canView =
        userRole === "super-admin" ||
        uploadedById === userId ||
        (donorId && donorId === userId) ||
        (userRole === "donor" &&
          caseReport.status === "approved" &&
          !caseReport.donor);

      if (!canView) {
        res.status(403).json({
          success: false,
          message: "Access denied to this case report",
        });
        return;
      }

      res.json({ success: true, data: { caseReport } });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error fetching case report" });
    }
  }
);

export default router;
