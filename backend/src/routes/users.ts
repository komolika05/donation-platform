import express from "express";
import User from "../models/User";
import Donation from "../models/Donation";
import CaseReport from "../models/CaseReport";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth";
import log from "../utils/logger";

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get donor dashboard data
// @access  Private (Donor)
router.get(
  "/dashboard",
  authenticate,
  authorize("donor"),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!._id;

      log("INFO", "Dashboard data requested", { userId });

      // Get user's donations with case reports
      const donations = await Donation.find({ donor: userId })
        .populate("caseReport", "title description cost photoUrl status")
        .sort({ date: -1 })
        .limit(10);

      // Get assigned case reports
      const assignedCases = await CaseReport.find({ donor: userId }).sort({
        createdAt: -1,
      });

      // Calculate total donated amount
      const totalDonated = await Donation.aggregate([
        { $match: { donor: userId, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      // Calculate remaining balance (total donated - total case costs)
      const totalCaseCosts = await CaseReport.aggregate([
        { $match: { donor: userId } },
        { $group: { _id: null, total: { $sum: "$cost" } } },
      ]);

      const balance =
        (totalDonated[0]?.total || 0) - (totalCaseCosts[0]?.total || 0);

      log("INFO", "Dashboard data retrieved successfully", {
        userId,
        donationsCount: donations.length,
        assignedCasesCount: assignedCases.length,
        totalDonated: totalDonated[0]?.total || 0,
        balance,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: req.user!._id,
            name: req.user!.name,
            email: req.user!.email,
            role: req.user!.role,
          },
          donations,
          assignedCases,
          summary: {
            totalDonated: totalDonated[0]?.total || 0,
            totalCases: assignedCases.length,
            remainingBalance: balance,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Dashboard data fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching dashboard data",
      });
    }
  }
);

// @route   GET /api/users/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Super Admin)
router.get(
  "/admin/dashboard",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res) => {
    try {
      log("INFO", "Admin dashboard data requested", { userId: req.user!._id });

      // Get pending case reports
      const pendingReports = await CaseReport.find({ status: "pending" })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      // Get recent donations
      const recentDonations = await Donation.find({ status: "completed" })
        .populate("donor", "name email")
        .populate("caseReport", "title")
        .sort({ date: -1 })
        .limit(20);

      // Get system statistics
      const stats = await Promise.all([
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "hospital-admin" }),
        Donation.countDocuments({ status: "completed" }),
        CaseReport.countDocuments({ status: "pending" }),
        CaseReport.countDocuments({ status: "approved" }),
        Donation.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

      const systemStats = {
        totalDonors: stats[0],
        totalHospitalAdmins: stats[1],
        totalDonations: stats[2],
        pendingReports: stats[3],
        approvedReports: stats[4],
        totalDonationAmount: stats[5][0]?.total || 0,
      };

      log("INFO", "Admin dashboard data retrieved successfully", {
        userId: req.user!._id,
        pendingReportsCount: pendingReports.length,
        recentDonationsCount: recentDonations.length,
        systemStats,
      });

      res.json({
        success: true,
        data: {
          pendingReports,
          recentDonations,
          systemStats,
        },
      });
    } catch (error) {
      log("ERROR", "Admin dashboard data fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching admin dashboard data",
      });
    }
  }
);

// @route   GET /api/users/hospital-admin/dashboard
// @desc    Get hospital admin dashboard data
// @access  Private (Hospital Admin)
router.get(
  "/hospital-admin/dashboard",
  authenticate,
  authorize("hospital-admin"),
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user!._id;

      log("INFO", "Hospital admin dashboard data requested", { userId });

      // Get reports uploaded by this hospital admin
      const myReports = await CaseReport.find({ uploadedBy: userId }).sort({
        createdAt: -1,
      });

      // Group reports by status
      const reportsByStatus = {
        pending: myReports.filter((report) => report.status === "pending"),
        approved: myReports.filter((report) => report.status === "approved"),
        rejected: myReports.filter((report) => report.status === "rejected"),
        assigned: myReports.filter((report) => report.status === "assigned"),
      };

      log("INFO", "Hospital admin dashboard data retrieved successfully", {
        userId,
        totalReports: myReports.length,
        reportsByStatus: {
          pending: reportsByStatus.pending.length,
          approved: reportsByStatus.approved.length,
          rejected: reportsByStatus.rejected.length,
          assigned: reportsByStatus.assigned.length,
        },
      });

      res.json({
        success: true,
        data: {
          user: {
            id: req.user!._id,
            name: req.user!.name,
            email: req.user!.email,
            role: req.user!.role,
          },
          reports: myReports,
          summary: {
            totalReports: myReports.length,
            pendingReports: reportsByStatus.pending.length,
            approvedReports: reportsByStatus.approved.length,
            rejectedReports: reportsByStatus.rejected.length,
            assignedReports: reportsByStatus.assigned.length,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Hospital admin dashboard data fetch error:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching hospital admin dashboard data",
      });
    }
  }
);

export default router;
