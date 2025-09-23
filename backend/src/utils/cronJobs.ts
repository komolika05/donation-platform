import cron from "node-cron";
import User from "../models/User";
import Donation from "../models/Donation";
import Receipt from "../models/Receipt";
import {
  generateReceiptPDF,
  generateReceiptNumber,
  calculateEligibleAmount,
} from "./receiptGenerator";
import { sendReceiptEmail } from "./emailService";
import logger from "./logger";

// Type for Receipt document
type ReceiptDoc = InstanceType<typeof Receipt>;

// Run annually on January 1st at 2:00 AM
export const scheduleAnnualReceiptGeneration = (): void => {
  cron.schedule(
    "0 2 1 1 *", // At 02:00 on January 1st
    async () => {
      logger.info("Starting annual receipt generation job");
      await generateAnnualReceipts();
    },
    {
      scheduled: true,
      timezone: "America/Toronto", // Adjust timezone as needed
    }
  );

  logger.info(
    "Annual receipt generation job scheduled for January 1st at 2:00 AM"
  );
};

// Manual trigger for testing or admin use
export const generateAnnualReceipts = async (year?: number): Promise<void> => {
  try {
    const targetYear = year || new Date().getFullYear() - 1; // Previous year by default

    logger.info("Generating annual receipts", { year: targetYear });

    const donorsWithDonations = await Donation.aggregate([
      {
        $match: {
          status: "completed",
          date: {
            $gte: new Date(`${targetYear}-01-01`),
            $lt: new Date(`${targetYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: "$donor",
          donations: { $push: "$$ROOT" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "donor",
        },
      },
      {
        $unwind: "$donor",
      },
    ]);

    logger.info(
      `Found ${donorsWithDonations.length} donors with donations in ${targetYear}`
    );

    let successCount = 0;
    let errorCount = 0;

    for (const donorData of donorsWithDonations) {
      try {
        const existingReceipt = await Receipt.findOne({
          donor: donorData._id,
          year: targetYear,
        });

        if (existingReceipt) {
          logger.info("Receipt already exists, skipping", {
            donorId: donorData._id,
            year: targetYear,
            receiptNumber: existingReceipt.receiptNumber,
          });
          continue;
        }

        const receiptNumber = generateReceiptNumber(
          targetYear,
          donorData._id.toString()
        );

        const eligibleAmount = calculateEligibleAmount(donorData.donations);

        const receipt: ReceiptDoc = new Receipt({
          donor: donorData._id,
          donations: donorData.donations.map((d: any) => d._id),
          totalAmount: eligibleAmount,
          year: targetYear,
          receiptNumber,
          craCompliantData: {
            donorName: donorData.donor.name,
            donorAddress: donorData.donor.address || "Address not provided",
            receiptNumber,
            donationDate: `January 1 - December 31, ${targetYear}`,
            eligibleAmount,
            organizationName: process.env["ORG_NAME"] || "JKVIS Foundation",
            organizationAddress:
              process.env["ORG_ADDRESS"] ||
              "123 Charity Street, Toronto, ON, M1A 1A1",
            organizationRegistrationNumber:
              process.env["ORG_REGISTRATION_NUMBER"] || "123456789RR0001",
          },
        });

        const pdfPath = await generateReceiptPDF({
          donor: donorData.donor,
          donations: donorData.donations,
          year: targetYear,
          receiptNumber,
          totalAmount: eligibleAmount,
        });

        receipt.pdfUrl = pdfPath;
        await receipt.save();

        await sendReceiptEmail(donorData.donor, receipt, pdfPath);

        successCount++;
        logger.info("Receipt generated and sent successfully", {
          donorId: donorData._id,
          donorEmail: donorData.donor.email,
          receiptNumber,
          totalAmount: eligibleAmount,
        });
      } catch (error) {
        errorCount++;
        logger.error("Error generating receipt for donor", {
          error,
          donorId: donorData._id,
          donorEmail: donorData.donor.email,
          year: targetYear,
        });
      }
    }

    logger.info("Annual receipt generation completed", {
      year: targetYear,
      totalDonors: donorsWithDonations.length,
      successCount,
      errorCount,
    });
  } catch (error) {
    logger.error("Error in annual receipt generation job:", error);
    throw error;
  }
};

// Generate receipt for a specific donor and year (admin function)
export const generateReceiptForDonor = async (
  donorId: string,
  year: number
): Promise<ReceiptDoc> => {
  try {
    logger.info("Generating receipt for specific donor", { donorId, year });

    const donor = await User.findById(donorId);
    if (!donor) throw new Error("Donor not found");

    const donations = await Donation.find({
      donor: donorId,
      status: "completed",
      date: {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${year + 1}-01-01`),
      },
    });

    if (donations.length === 0)
      throw new Error(
        "No completed donations found for this donor in the specified year"
      );

    let receipt = await Receipt.findOne({ donor: donorId, year });

    if (receipt) {
      logger.info("Receipt already exists", {
        donorId,
        year,
        receiptNumber: receipt.receiptNumber,
      });
      return receipt as ReceiptDoc;
    }

    const receiptNumber = generateReceiptNumber(year, donorId);
    const eligibleAmount = calculateEligibleAmount(donations);

    receipt = new Receipt({
      donor: donorId,
      donations: donations.map((d) => d._id),
      totalAmount: eligibleAmount,
      year,
      receiptNumber,
      craCompliantData: {
        donorName: donor.name,
        donorAddress: donor.address || "Address not provided",
        receiptNumber,
        donationDate: `January 1 - December 31, ${year}`,
        eligibleAmount,
        organizationName: process.env["ORG_NAME"] || "JKVIS Foundation",
        organizationAddress:
          process.env["ORG_ADDRESS"] ||
          "123 Charity Street, Toronto, ON, M1A 1A1",
        organizationRegistrationNumber:
          process.env["ORG_REGISTRATION_NUMBER"] || "123456789RR0001",
      },
    }) as ReceiptDoc;

    const pdfPath = await generateReceiptPDF({
      donor,
      donations,
      year,
      receiptNumber,
      totalAmount: eligibleAmount,
    });

    receipt.pdfUrl = pdfPath;
    await receipt.save();

    await sendReceiptEmail(donor, receipt, pdfPath);

    logger.info("Receipt generated successfully for donor", {
      donorId,
      receiptNumber,
      totalAmount: eligibleAmount,
    });

    return receipt;
  } catch (error) {
    logger.error("Error generating receipt for donor:", {
      error,
      donorId,
      year,
    });
    throw error;
  }
};
