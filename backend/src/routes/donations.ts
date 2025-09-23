import express, { Request, Response } from "express";
import Donation from "../models/Donation";
import CaseReport from "../models/CaseReport";
import { authenticate, type AuthRequest } from "../middleware/auth";
import { body, validationResult } from "express-validator";
import {
  createStripePaymentIntent,
  confirmStripePayment,
  createPayPalPayment,
  executePayPalPayment,
  stripe,
} from "../utils/paymentService";
import logger from "../utils/logger";

const router = express.Router();

// Validation middleware for donations
const validateDonation = [
  body("amount")
    .isFloat({ min: 1, max: 1000000 })
    .withMessage("Amount must be between $1 and $1,000,000"),
  body("currency")
    .isIn(["USD", "CAD"])
    .withMessage("Currency must be USD or CAD"),
  body("type")
    .isIn(["sponsorship", "20kids20", "general"])
    .withMessage("Type must be sponsorship, 20kids20, or general"),
  body("caseReportId")
    .optional()
    .isMongoId()
    .withMessage("Invalid case report ID"),
  body("paymentMethod")
    .isIn(["stripe", "paypal"])
    .withMessage("Payment method must be stripe or paypal"),
];

// -------------------- Stripe Payment Intent --------------------
router.post(
  "/create-payment-intent",
  authenticate,
  validateDonation,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { amount, currency, type, caseReportId } = req.body;
      const userId = req.user!._id;

      logger.info("Creating payment intent", {
        userId,
        amount,
        currency,
        type,
        caseReportId,
      });

      let caseReport = null;
      if (type === "sponsorship" || type === "20kids20") {
        if (!caseReportId) {
          res.status(400).json({
            success: false,
            message:
              "Case report is required for sponsorship and 20kids20 donations",
          });
          return;
        }

        caseReport = await CaseReport.findById(caseReportId);
        if (!caseReport) {
          res
            .status(404)
            .json({ success: false, message: "Case report not found" });
          return;
        }

        if (caseReport.status !== "approved") {
          res.status(400).json({
            success: false,
            message: "Case report is not approved for donations",
          });
          return;
        }

        if (caseReport.donor) {
          res.status(400).json({
            success: false,
            message: "Case report is already assigned to another donor",
          });
          return;
        }
      }

      const paymentIntent = await createStripePaymentIntent(amount, currency, {
        userId: userId!.toString(),
        type,
        caseReportId: caseReportId || "",
      });

      logger.info("Payment intent created successfully", {
        paymentIntentId: paymentIntent.id,
        userId,
      });

      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.clientSecret,
          paymentIntentId: paymentIntent.id,
        },
      });
    } catch (error) {
      logger.error("Error creating payment intent:", error);
      res.status(500).json({
        success: false,
        message: "Server error creating payment intent",
      });
    }
  }
);

// -------------------- PayPal Payment --------------------
router.post(
  "/create-paypal-payment",
  authenticate,
  validateDonation,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
        return;
      }

      const { amount, currency, type, caseReportId } = req.body;
      const userId = req.user!._id;

      logger.info("Creating PayPal payment", {
        userId,
        amount,
        currency,
        type,
        caseReportId,
      });

      let caseReport = null;
      if (type === "sponsorship" || type === "20kids20") {
        if (!caseReportId) {
          res.status(400).json({
            success: false,
            message:
              "Case report is required for sponsorship and 20kids20 donations",
          });
          return;
        }

        caseReport = await CaseReport.findById(caseReportId);
        if (
          !caseReport ||
          caseReport.status !== "approved" ||
          caseReport.donor
        ) {
          res.status(400).json({
            success: false,
            message: "Invalid case report for donation",
          });
          return;
        }
      }

      const returnUrl = `${process.env["FRONTEND_URL"]}/donation/paypal/success`;
      const cancelUrl = `${process.env["FRONTEND_URL"]}/donation/paypal/cancel`;
      const description = `JKVIS ${type} donation`;

      const payment = await createPayPalPayment(
        amount,
        currency,
        returnUrl,
        cancelUrl,
        description
      );

      logger.info("PayPal payment created successfully", {
        paymentId: payment.id,
        userId,
      });

      res.json({
        success: true,
        data: { paymentId: payment.id, approvalUrl: payment.approvalUrl },
      });
    } catch (error) {
      logger.error("Error creating PayPal payment:", error);
      res.status(500).json({
        success: false,
        message: "Server error creating PayPal payment",
      });
    }
  }
);

// -------------------- Confirm Stripe Payment --------------------
router.post(
  "/confirm-stripe",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { paymentIntentId } = req.body;
      const userId = req.user!._id;

      if (!paymentIntentId) {
        res
          .status(400)
          .json({ success: false, message: "Payment intent ID is required" });
        return;
      }

      logger.info("Confirming Stripe payment", { paymentIntentId, userId });

      const paymentIntent = await confirmStripePayment(paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        res
          .status(400)
          .json({ success: false, message: "Payment was not successful" });
        return;
      }

      const stripePaymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      const metadata = stripePaymentIntent.metadata;

      const donation = new Donation({
        donor: userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        type: metadata["type"],
        caseReport: metadata["caseReportId"] || undefined,
        paymentMethod: "stripe",
        transactionId: paymentIntentId,
        status: "completed",
      });

      await donation.save();

      if (metadata["caseReportId"]) {
        await CaseReport.findByIdAndUpdate(metadata["caseReportId"], {
          donor: userId,
          status: "assigned",
        });
      }

      logger.info("Donation created successfully", {
        donationId: donation._id,
        userId,
        amount: donation.amount,
      });

      res.json({
        success: true,
        message: "Donation completed successfully",
        data: {
          donation: {
            id: donation._id,
            amount: donation.amount,
            currency: donation.currency,
            type: donation.type,
            date: donation.date,
          },
        },
      });
    } catch (error) {
      logger.error("Error confirming Stripe payment:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error confirming payment" });
    }
  }
);

// -------------------- Confirm PayPal Payment --------------------
router.post(
  "/confirm-paypal",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { paymentId, payerId, type, caseReportId } = req.body;
      const userId = req.user!._id;

      if (!paymentId || !payerId) {
        res.status(400).json({
          success: false,
          message: "Payment ID and Payer ID are required",
        });
        return;
      }

      logger.info("Confirming PayPal payment", { paymentId, payerId, userId });

      const payment = await executePayPalPayment(paymentId, payerId);

      if (payment.status !== "approved") {
        res
          .status(400)
          .json({ success: false, message: "Payment was not approved" });
        return;
      }

      const donation = new Donation({
        donor: userId,
        amount: payment.amount,
        currency: payment.currency,
        type,
        caseReport: caseReportId || undefined,
        paymentMethod: "paypal",
        transactionId: paymentId,
        status: "completed",
      });

      await donation.save();

      if (caseReportId) {
        await CaseReport.findByIdAndUpdate(caseReportId, {
          donor: userId,
          status: "assigned",
        });
      }

      logger.info("PayPal donation created successfully", {
        donationId: donation._id,
        userId,
        amount: donation.amount,
      });

      res.json({
        success: true,
        message: "Donation completed successfully",
        data: {
          donation: {
            id: donation._id,
            amount: donation.amount,
            currency: donation.currency,
            type: donation.type,
            date: donation.date,
          },
        },
      });
    } catch (error) {
      logger.error("Error confirming PayPal payment:", error);
      res.status(500).json({
        success: false,
        message: "Server error confirming PayPal payment",
      });
    }
  }
);

// -------------------- My Donations --------------------
router.get(
  "/my-donations",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;
      const page = parseInt(req.query["page"] as string) || 1;
      const limit = parseInt(req.query["limit"] as string) || 10;
      const skip = (page - 1) * limit;

      logger.info("Fetching user donations", { userId, page, limit });

      const donations = await Donation.find({ donor: userId })
        .populate("caseReport", "title description cost photoUrl")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const totalDonations = await Donation.countDocuments({ donor: userId });
      const totalPages = Math.ceil(totalDonations / limit);

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
        },
      });
    } catch (error) {
      logger.error("Error fetching user donations:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error fetching donations" });
    }
  }
);

// -------------------- Available Cases --------------------
router.get(
  "/available-cases",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const fundType = req.query["fundType"] as string;

      const query: any = { status: "approved", donor: null };
      if (fundType && ["sponsorship", "20kids20"].includes(fundType)) {
        query.fundType = fundType;
      }

      const cases = await CaseReport.find(query)
        .populate("uploadedBy", "name")
        .sort({ createdAt: -1 });

      res.json({ success: true, data: { cases } });
    } catch (error) {
      logger.error("Error fetching available cases:", error);
      res.status(500).json({
        success: false,
        message: "Server error fetching available cases",
      });
    }
  }
);

// -------------------- Stripe Webhook --------------------
router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"]!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      logger.info("Stripe webhook received", { eventType: event.type });
    } catch (err) {
      logger.error("Stripe webhook signature verification failed:", err);
      res.status(400).send("Webhook signature verification failed");
      return;
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          logger.info("Payment intent succeeded", {
            paymentIntentId: event.data.object.id,
          });
          break;
        case "payment_intent.payment_failed":
          await Donation.findOneAndUpdate(
            { transactionId: event.data.object.id },
            { status: "failed" }
          );
          logger.warn("Payment intent failed", {
            paymentIntentId: event.data.object.id,
          });
          break;
        default:
          logger.info("Unhandled Stripe webhook event", {
            eventType: event.type,
          });
      }

      res.json({ received: true });
    } catch (error) {
      logger.error("Error processing Stripe webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
);

export default router;
