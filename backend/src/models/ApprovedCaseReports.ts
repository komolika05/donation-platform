// models/approvedCaseReport.ts

import mongoose, { Schema } from "mongoose";
// You might want to create a separate IApprovedCaseReport type
import type { ICaseReport } from "../types";

// Let's assume IApprovedCaseReport extends ICaseReport with raisedAmount
interface IApprovedCaseReport extends ICaseReport {
  raisedAmount: number;
}

const ApprovedCaseReportSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: [1, "Cost must be at least $1"],
      max: [100000, "Cost cannot exceed $100,000"],
    },
    // ✅ ADDED THIS FIELD
    raisedAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Raised amount cannot be negative"],
    },
    fundType: {
      type: String,
      enum: {
        values: ["sponsorship", "20kids20"],
        message: "Fund type must be either sponsorship or 20kids20",
      },
      required: [true, "Fund type is required"],
    },
    photoUrl: {
      type: String,
      required: [true, "Photo URL is required"],
      trim: true,
    },
    HospitalId: {
      type: String,
      ref: "User",
      required: [true, "Uploaded by user is required"],
    },
    // ✅ UPDATED STATUS ENUM
    status: {
      type: String,
      enum: {
        values: ["approved", "assigned"], // No longer needs 'pending' or 'rejected'
        message: "Status must be approved or assigned",
      },
      default: "approved",
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // We'll let Mongoose handle this upon creation
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // ✅ NEW COLLECTION NAME
    collection: "case-reports",
  }
);

// Indexes
ApprovedCaseReportSchema.index({ status: 1, createdAt: -1 });
ApprovedCaseReportSchema.index({ HospitalId: 1 });
ApprovedCaseReportSchema.index({ donor: 1 });
ApprovedCaseReportSchema.index({ fundType: 1 });

// Virtual
ApprovedCaseReportSchema.virtual("isAvailable").get(function () {
  return this["status"] === "approved" && !this["donor"];
});

export default mongoose.model<IApprovedCaseReport>(
  "ApprovedCaseReport",
  ApprovedCaseReportSchema
);
