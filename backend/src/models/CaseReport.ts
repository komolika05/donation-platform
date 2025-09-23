import mongoose, { Schema } from "mongoose";
import type { ICaseReport } from "../types";

const CaseReportSchema: Schema = new Schema(
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
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploaded by user is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected", "assigned"],
        message: "Status must be pending, approved, rejected, or assigned",
      },
      default: "pending",
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
CaseReportSchema.index({ status: 1, createdAt: -1 });
CaseReportSchema.index({ uploadedBy: 1 });
CaseReportSchema.index({ donor: 1 });
CaseReportSchema.index({ fundType: 1 });

// Virtual for availability status
CaseReportSchema.virtual("isAvailable").get(function () {
  return this["status"] === "approved" && !this["donor"];
});

export default mongoose.model<ICaseReport>("CaseReport", CaseReportSchema);
