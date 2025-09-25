import express from "express";
import Receipt from "../models/Receipt";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth";
import {
  generateReceiptForDonor,
  generateAnnualReceipts,
} from "../utils/cronJobs";
import { body, validationResult } from "express-validator";
import log from "../utils/logger";
import path from "path";
import fs from "fs";

const router = express.Router();

// @route   GET /api/receipts/my-receipts
// @desc    Get user's tax receipts
// @access  Private (Donor)
router.get(
  "/my-receipts",
  authenticate,
  authorize("donor"),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!._id;
      const page = Number.parseInt(req.query["page"] as string) || 1;
      const limit = Number.parseInt(req.query["limit"] as string) || 10;
      const skip = (page - 1) * limit;

      log("INFO", "Fetching user receipts", { userId, page, limit });

      const receipts = await Receipt.find({ donor: userId })
        .populate("donations", "amount currency date type")
        .sort({ year: -1, issuedAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalReceipts = await Receipt.countDocuments({ donor: userId });
      const totalPages = Math.ceil(totalReceipts / limit);

      log("INFO", "User receipts fetched successfully", {
        userId,
        receiptsCount: receipts.length,
        totalReceipts,
      });

      res.json({
        success: true,
        data: {
          receipts,
          pagination: {
            currentPage: page,
            totalPages,
            totalReceipts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Error fetching user receipts:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching receipts",
      });
    }
  }
);

// @route   GET /api/receipts/:id/download
// @desc    Download receipt PDF
// @access  Private
router.get(
  "/:id/download",
  authenticate,
  async (req: AuthRequest, res): Promise<any | void> => {
    try {
      const { id } = req.params;
      const userId = req.user!._id;
      const userRole = req.user!.role;

      log("INFO", "Receipt download requested", {
        receiptId: id,
        userId,
        userRole,
      });

      const receipt = await Receipt.findById(id).populate(
        "donor",
        "name email"
      );

      if (!receipt) {
        return res.status(404).json({
          success: false,
          message: "Receipt not found",
        });
      }

      // Check permissions
      const canDownload =
        userRole === "super-admin" ||
        (typeof receipt.donor === "object" &&
        receipt.donor !== null &&
        " _id" in receipt.donor
          ? (receipt.donor as { _id: any })._id.toString() ===
            userId?.toString()
          : receipt.donor?.toString() === userId?.toString());

      if (!canDownload) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this receipt",
        });
      }

      if (!receipt.pdfUrl) {
        return res.status(404).json({
          success: false,
          message: "PDF not available for this receipt",
        });
      }

      const pdfPath = path.join(__dirname, "../..", receipt.pdfUrl);

      if (!fs.existsSync(pdfPath)) {
        log("ERROR", "PDF file not found on disk", {
          receiptId: id,
          pdfPath,
        });
        return res.status(404).json({
          success: false,
          message: "PDF file not found",
        });
      }

      log("INFO", "Serving receipt PDF", {
        receiptId: id,
        userId,
        filename: path.basename(pdfPath),
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="Receipt-${receipt.receiptNumber}.pdf"`
      );

      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } catch (error) {
      log("ERROR", "Error downloading receipt:", error);
      res.status(500).json({
        success: false,
        message: "Server error downloading receipt",
      });
    }
  }
);

// @route   POST /api/receipts/generate
// @desc    Generate receipt for specific donor and year (Admin only)
// @access  Private (Super Admin)
router.post(
  "/generate",
  authenticate,
  authorize("super-admin"),
  [
    body("donorId").isMongoId().withMessage("Valid donor ID is required"),
    body("year")
      .isInt({ min: 2020, max: new Date().getFullYear() })
      .withMessage("Valid year is required"),
  ],
  async (req: AuthRequest, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { donorId, year } = req.body;

      log("INFO", "Manual receipt generation requested", {
        adminId: req.user!._id,
        donorId,
        year,
      });

      const receipt = await generateReceiptForDonor(donorId, year);

      log("INFO", "Manual receipt generated successfully", {
        adminId: req.user!._id,
        receiptId: receipt._id,
        receiptNumber: receipt.receiptNumber,
      });

      res.json({
        success: true,
        message: "Receipt generated successfully",
        data: {
          receipt: {
            id: receipt._id,
            receiptNumber: receipt.receiptNumber,
            year: receipt.year,
            totalAmount: receipt.totalAmount,
            issuedAt: receipt.issuedAt,
          },
        },
      });
    } catch (error: any) {
      log("ERROR", "Error in manual receipt generation:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Server error generating receipt",
      });
    }
  }
);

// @route   POST /api/receipts/generate-annual
// @desc    Generate annual receipts for all donors (Admin only)
// @access  Private (Super Admin)
router.post(
  "/generate-annual",
  authenticate,
  authorize("super-admin"),
  [
    body("year")
      .optional()
      .isInt({ min: 2020, max: new Date().getFullYear() })
      .withMessage("Valid year is required"),
  ],
  async (req: AuthRequest, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { year } = req.body;
      const targetYear = year || new Date().getFullYear() - 1;

      log("INFO", "Annual receipt generation requested", {
        adminId: req.user!._id,
        year: targetYear,
      });

      // Run in background to avoid timeout
      generateAnnualReceipts(targetYear).catch((error) => {
        log("ERROR", "Error in background annual receipt generation:", error);
      });

      res.json({
        success: true,
        message: `Annual receipt generation started for ${targetYear}. This process will run in the background.`,
        data: {
          year: targetYear,
        },
      });
    } catch (error) {
      log("ERROR", "Error starting annual receipt generation:", error);
      res.status(500).json({
        success: false,
        message: "Server error starting receipt generation",
      });
    }
  }
);

// @route   GET /api/receipts/admin/all
// @desc    Get all receipts (Admin only)
// @access  Private (Super Admin)
router.get(
  "/admin/all",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res) => {
    try {
      const page = Number.parseInt(req.query["page"] as string) || 1;
      const limit = Number.parseInt(req.query["limit"] as string) || 20;
      const skip = (page - 1) * limit;
      const year = req.query["year"] as string;

      log("INFO", "Admin receipts list requested", {
        userId: req.user!._id,
        page,
        limit,
        year,
      });

      const query: any = {};
      if (year) {
        query.year = Number.parseInt(year);
      }

      const [receipts, totalReceipts] = await Promise.all([
        Receipt.find(query)
          .populate("donor", "name email")
          .sort({ year: -1, issuedAt: -1 })
          .skip(skip)
          .limit(limit),
        Receipt.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalReceipts / limit);

      // Calculate total amount
      const totalAmount = await Receipt.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);

      log("INFO", "Admin receipts list fetched successfully", {
        userId: req.user!._id,
        receiptsCount: receipts.length,
        totalReceipts,
      });

      res.json({
        success: true,
        data: {
          receipts,
          pagination: {
            currentPage: page,
            totalPages,
            totalReceipts,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          summary: {
            totalAmount: totalAmount[0]?.total || 0,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Error fetching admin receipts:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching receipts",
      });
    }
  }
);

export default router;
