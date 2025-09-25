import express from "express";
import User from "../models/User";
import Donation from "../models/Donation";
import CaseReport from "../models/CaseReport";
import Receipt from "../models/Receipt";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth";
import { body, validationResult } from "express-validator";
import log from "../utils/logger";

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get comprehensive admin dashboard data
// @access  Private (Super Admin)
router.get(
  "/dashboard",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res) => {
    try {
      log("INFO", "Admin dashboard requested", { userId: req.user!._id });

      // Get comprehensive statistics
      const [
        totalUsers,
        totalDonors,
        totalHospitalAdmins,
        totalDonations,
        totalDonationAmount,
        pendingReports,
        approvedReports,
        assignedReports,
        recentDonations,
        recentUsers,
        monthlyDonations,
        topDonors,
      ] = await Promise.all([
        // User statistics
        User.countDocuments(),
        User.countDocuments({ role: "donor" }),
        User.countDocuments({ role: "hospital-admin" }),

        // Donation statistics
        Donation.countDocuments({ status: "completed" }),
        Donation.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        // Case report statistics
        CaseReport.countDocuments({ status: "pending" }),
        CaseReport.countDocuments({ status: "approved" }),
        CaseReport.countDocuments({ status: "assigned" }),

        // Recent activity
        Donation.find({ status: "completed" })
          .populate("donor", "name email")
          .populate("caseReport", "title")
          .sort({ date: -1 })
          .limit(10),

        User.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select("name email role createdAt"),

        // Monthly donation trends (last 12 months)
        Donation.aggregate([
          {
            $match: {
              status: "completed",
              date: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
              },
              totalAmount: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),

        // Top donors
        Donation.aggregate([
          { $match: { status: "completed" } },
          {
            $group: {
              _id: "$donor",
              totalDonated: { $sum: "$amount" },
              donationCount: { $sum: 1 },
            },
          },
          { $sort: { totalDonated: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "donor",
            },
          },
          { $unwind: "$donor" },
          {
            $project: {
              donorName: "$donor.name",
              donorEmail: "$donor.email",
              totalDonated: 1,
              donationCount: 1,
            },
          },
        ]),
      ]);

      const dashboardData = {
        statistics: {
          users: {
            total: totalUsers,
            donors: totalDonors,
            hospitalAdmins: totalHospitalAdmins,
          },
          donations: {
            total: totalDonations,
            totalAmount: totalDonationAmount[0]?.total || 0,
          },
          caseReports: {
            pending: pendingReports,
            approved: approvedReports,
            assigned: assignedReports,
          },
        },
        recentActivity: {
          donations: recentDonations,
          users: recentUsers,
        },
        analytics: {
          monthlyDonations,
          topDonors,
        },
      };

      log("INFO", "Admin dashboard data compiled successfully", {
        userId: req.user!._id,
        totalUsers,
        totalDonations,
        pendingReports,
      });

      res.json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      log("ERROR", "Error fetching admin dashboard:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching dashboard data",
      });
    }
  }
);

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Super Admin)
router.get(
  "/users",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res) => {
    try {
      const page = Number.parseInt(req.query["page"] as string) || 1;
      const limit = Number.parseInt(req.query["limit"] as string) || 20;
      const skip = (page - 1) * limit;
      const role = req.query["role"] as string;
      const search = req.query["search"] as string;

      log("INFO", "Admin users list requested", {
        userId: req.user!._id,
        page,
        limit,
        role,
        search,
      });

      // Build query
      const query: any = {};
      if (role && ["donor", "hospital-admin", "super-admin"].includes(role)) {
        query.role = role;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const [users, totalUsers] = await Promise.all([
        User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalUsers / limit);

      log("INFO", "Admin users list fetched successfully", {
        userId: req.user!._id,
        usersCount: users.length,
        totalUsers,
      });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: page,
            totalPages,
            totalUsers,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Error fetching users list:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching users",
      });
    }
  }
);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Super Admin)
router.put(
  "/users/:id/role",
  authenticate,
  authorize("super-admin"),
  [
    body("role")
      .isIn(["donor", "hospital-admin", "super-admin"])
      .withMessage("Invalid role"),
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

      const { id } = req.params;
      const { role } = req.body;

      log("INFO", "Updating user role", {
        adminId: req.user!._id,
        targetUserId: id,
        newRole: role,
      });

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent admin from changing their own role
      if (user._id?.toString() === req.user!._id?.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot change your own role",
        });
      }

      const oldRole = user.role;
      user.role = role;
      await user.save();

      log("INFO", "User role updated successfully", {
        adminId: req.user!._id,
        targetUserId: id,
        oldRole,
        newRole: role,
      });

      res.json({
        success: true,
        message: "User role updated successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Error updating user role:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating user role",
      });
    }
  }
);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user account
// @access  Private (Super Admin)
router.delete(
  "/users/:id",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res): Promise<any | void> => {
    try {
      const { id } = req.params;

      log("INFO", "Deleting user account", {
        adminId: req.user!._id,
        targetUserId: id,
      });

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent admin from deleting their own account
      if (user._id?.toString() === req.user!._id?.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      // Check if user has associated data
      const [donationCount, caseReportCount] = await Promise.all([
        Donation.countDocuments({ donor: id }),
        CaseReport.countDocuments({ $or: [{ uploadedBy: id }, { donor: id }] }),
      ]);

      if (donationCount > 0 || caseReportCount > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete user with associated donations or case reports",
          data: {
            donationCount,
            caseReportCount,
          },
        });
      }

      await User.findByIdAndDelete(id);

      log("INFO", "User account deleted successfully", {
        adminId: req.user!._id,
        deletedUserId: id,
        deletedUserEmail: user.email,
      });

      res.json({
        success: true,
        message: "User account deleted successfully",
      });
    } catch (error) {
      log("ERROR", "Error deleting user account:", error);
      res.status(500).json({
        success: false,
        message: "Server error deleting user account",
      });
    }
  }
);

// @route   GET /api/admin/donations
// @desc    Get all donations with filtering and pagination
// @access  Private (Super Admin)
router.get(
  "/donations",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res) => {
    try {
      const page = Number.parseInt(req.query["page"] as string) || 1;
      const limit = Number.parseInt(req.query["limit"] as string) || 20;
      const skip = (page - 1) * limit;
      const status = req.query["status"] as string;
      const type = req.query["type"] as string;
      const startDate = req.query["startDate"] as string;
      const endDate = req.query["endDate"] as string;

      log("INFO", "Admin donations list requested", {
        userId: req.user!._id,
        page,
        limit,
        status,
        type,
        startDate,
        endDate,
      });

      // Build query
      const query: any = {};
      if (status && ["pending", "completed", "failed"].includes(status)) {
        query.status = status;
      }
      if (type && ["sponsorship", "20kids20", "general"].includes(type)) {
        query.type = type;
      }
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const [donations, totalDonations] = await Promise.all([
        Donation.find(query)
          .populate("donor", "name email")
          .populate("caseReport", "title cost")
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit),
        Donation.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalDonations / limit);

      // Calculate total amount for filtered donations
      const totalAmount = await Donation.aggregate([
        { $match: { ...query, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      log("INFO", "Admin donations list fetched successfully", {
        userId: req.user!._id,
        donationsCount: donations.length,
        totalDonations,
        totalAmount: totalAmount[0]?.total || 0,
      });

      res.json({
        success: true,
        data: {
          donations,
          pagination: {
            currentPage: page,
            totalPages,
            totalDonations,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          summary: {
            totalAmount: totalAmount[0]?.total || 0,
          },
        },
      });
    } catch (error) {
      log("ERROR", "Error fetching donations list:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching donations",
      });
    }
  }
);

// @route   GET /api/admin/reports/analytics
// @desc    Get detailed analytics for case reports
// @access  Private (Super Admin)
router.get(
  "/reports/analytics",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res) => {
    try {
      log("INFO", "Admin reports analytics requested", {
        userId: req.user!._id,
      });

      const [
        statusDistribution,
        fundTypeDistribution,
        monthlyUploads,
        hospitalAdminStats,
        averageCosts,
        assignmentRate,
      ] = await Promise.all([
        // Status distribution
        CaseReport.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        // Fund type distribution
        CaseReport.aggregate([
          { $group: { _id: "$fundType", count: { $sum: 1 } } },
        ]),

        // Monthly uploads (last 12 months)
        CaseReport.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),

        // Hospital admin statistics
        CaseReport.aggregate([
          { $group: { _id: "$uploadedBy", count: { $sum: 1 } } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "admin",
            },
          },
          { $unwind: "$admin" },
          {
            $project: {
              adminName: "$admin.name",
              adminEmail: "$admin.email",
              reportCount: "$count",
            },
          },
          { $sort: { reportCount: -1 } },
        ]),

        // Average costs by fund type
        CaseReport.aggregate([
          {
            $group: {
              _id: "$fundType",
              averageCost: { $avg: "$cost" },
              totalCost: { $sum: "$cost" },
            },
          },
        ]),

        // Assignment rate (approved reports that got assigned)
        CaseReport.aggregate([
          { $match: { status: { $in: ["approved", "assigned"] } } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      ]);

      const analytics = {
        statusDistribution: statusDistribution.reduce((acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        fundTypeDistribution: fundTypeDistribution.reduce(
          (acc: any, item: any) => {
            acc[item._id] = item.count;
            return acc;
          },
          {}
        ),
        monthlyUploads,
        hospitalAdminStats,
        averageCosts: averageCosts.reduce((acc: any, item: any) => {
          acc[item._id] = {
            average: Math.round(item.averageCost * 100) / 100,
            total: item.totalCost,
          };
          return acc;
        }, {}),
        assignmentRate: {
          approved:
            assignmentRate.find((item: any) => item._id === "approved")
              ?.count || 0,
          assigned:
            assignmentRate.find((item: any) => item._id === "assigned")
              ?.count || 0,
        },
      };

      log("INFO", "Admin reports analytics compiled successfully", {
        userId: req.user!._id,
        analytics,
      });

      res.json({
        success: true,
        data: {
          analytics,
        },
      });
    } catch (error) {
      log("ERROR", "Error fetching reports analytics:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching analytics",
      });
    }
  }
);

// @route   GET /api/admin/system/health
// @desc    Get system health and performance metrics
// @access  Private (Super Admin)
router.get(
  "/system/health",
  authenticate,
  authorize("super-admin"),
  async (req: AuthRequest, res) => {
    try {
      log("INFO", "System health check requested", { userId: req.user!._id });

      const [dbStats, recentErrors, activeUsers, systemMetrics] =
        await Promise.all([
          // Database statistics
          Promise.all([
            User.countDocuments(),
            Donation.countDocuments(),
            CaseReport.countDocuments(),
            Receipt.countDocuments(),
          ]),

          // Recent error logs (this would typically come from your logging system)
          // For now, we'll return a placeholder
          Promise.resolve([]),

          // Active users (users who logged in within last 30 days)
          User.countDocuments({
            // This would require a lastLoginAt field in the User model
            // For now, we'll use createdAt as a proxy
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          }),

          // System metrics
          Promise.resolve({
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.version,
            environment: process.env["NODE_ENV"] || "development",
          }),
        ]);

      const healthData = {
        database: {
          users: dbStats[0],
          donations: dbStats[1],
          caseReports: dbStats[2],
          receipts: dbStats[3],
          status: "healthy", // In production, you'd check actual DB health
        },
        system: {
          ...systemMetrics,
          memoryUsage: {
            rss: Math.round(systemMetrics.memoryUsage.rss / 1024 / 1024),
            heapTotal: Math.round(
              systemMetrics.memoryUsage.heapTotal / 1024 / 1024
            ),
            heapUsed: Math.round(
              systemMetrics.memoryUsage.heapUsed / 1024 / 1024
            ),
            external: Math.round(
              systemMetrics.memoryUsage.external / 1024 / 1024
            ),
          },
        },
        activity: {
          activeUsers,
          recentErrors: recentErrors.length,
        },
      };

      log("INFO", "System health data compiled successfully", {
        userId: req.user!._id,
        healthData,
      });

      res.json({
        success: true,
        data: healthData,
      });
    } catch (error) {
      log("ERROR", "Error fetching system health:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching system health",
      });
    }
  }
);

export default router;
