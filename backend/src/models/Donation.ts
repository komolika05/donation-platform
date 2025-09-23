import mongoose, { Schema } from "mongoose";
import type { IDonation } from "../types";

const DonationSchema: Schema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donor is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be at least $1"],
      max: [1000000, "Amount cannot exceed $1,000,000"],
    },
    currency: {
      type: String,
      enum: {
        values: ["USD", "CAD"],
        message: "Currency must be either USD or CAD",
      },
      required: [true, "Currency is required"],
    },
    type: {
      type: String,
      enum: {
        values: ["sponsorship", "20kids20", "general"],
        message: "Type must be sponsorship, 20kids20, or general",
      },
      required: [true, "Donation type is required"],
    },
    caseReport: {
      type: Schema.Types.ObjectId,
      ref: "CaseReport",
      required: function (this: IDonation) {
        return this.type === "sponsorship" || this.type === "20kids20";
      },
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: ["stripe", "paypal", "bank_transfer"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed", "failed"],
        message: "Status must be pending, completed, or failed",
      },
      default: "completed",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
DonationSchema.index({ donor: 1, date: -1 });
DonationSchema.index({ transactionId: 1 });
DonationSchema.index({ status: 1 });
DonationSchema.index({ type: 1 });
DonationSchema.index({ date: -1 });

// Virtual for formatted amount
DonationSchema.virtual("formattedAmount").get(function (this: IDonation) {
  return `${this.currency} $${this.amount.toFixed(2)}`;
});

export default mongoose.model<IDonation>("Donation", DonationSchema);
