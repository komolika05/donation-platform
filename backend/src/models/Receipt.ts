import mongoose, { Schema } from "mongoose";
import type { IReceipt } from "../types";

const ReceiptSchema: Schema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donor is required"],
    },
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donation",
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2020, "Year must be 2020 or later"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    craCompliantData: {
      donorName: { type: String, required: true },
      donorAddress: { type: String, required: true },
      receiptNumber: { type: String, required: true },
      donationDate: { type: String, required: true },
      eligibleAmount: { type: Number, required: true },
      organizationName: { type: String, required: true },
      organizationAddress: { type: String, required: true },
      organizationRegistrationNumber: { type: String, required: true },
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    receiptNumber: {
      type: String,
      required: [true, "Receipt number is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
ReceiptSchema.index({ donor: 1, year: -1 });
ReceiptSchema.index({ receiptNumber: 1 });
ReceiptSchema.index({ year: 1 });

// Generate receipt number before saving
ReceiptSchema.pre("save", function (next) {
  if (!this["receiptNumber"]) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this["receiptNumber"] = `JKVIS-${this["year"]}-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model<IReceipt>("Receipt", ReceiptSchema);
