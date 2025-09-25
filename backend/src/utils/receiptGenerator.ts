import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import log from "./logger";
import type { IDonation, IUser } from "../types";

// Ensure receipts directory exists
const receiptsDir = path.join(__dirname, "../../uploads/receipts");
if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
  log("INFO", "Created receipts directory", { path: receiptsDir });
}

export interface ReceiptData {
  donor: IUser;
  donations: IDonation[];
  year: number;
  receiptNumber: string;
  totalAmount: number;
}

export const generateReceiptPDF = async (
  receiptData: ReceiptData
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      log("INFO", "Generating PDF receipt", {
        donorId: receiptData.donor._id,
        year: receiptData.year,
        receiptNumber: receiptData.receiptNumber,
        totalAmount: receiptData.totalAmount,
      });

      const doc = new PDFDocument({ margin: 50 });
      const filename = `receipt-${receiptData.receiptNumber}.pdf`;
      const filepath = path.join(receiptsDir, filename);

      // Pipe the PDF to a file
      doc.pipe(fs.createWriteStream(filepath));

      // Header with organization info
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("OFFICIAL DONATION RECEIPT", 50, 50, { align: "center" });

      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(process.env["ORG_NAME"] || "JKVIS Foundation", 50, 90, {
          align: "center",
        });

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          process.env["ORG_ADDRESS"] ||
            "123 Charity Street, Toronto, ON, M1A 1A1",
          50,
          115,
          { align: "center" }
        )
        .text(`Phone: ${process.env["ORG_PHONE"] || "+1-416-555-0123"}`, {
          align: "center",
        })
        .text(`Email: ${process.env["ORG_EMAIL"] || "info@jkvis.org"}`, {
          align: "center",
        });

      // Registration number
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text(
          `Registration Number: ${
            process.env["ORG_REGISTRATION_NUMBER"] || "123456789RR0001"
          }`,
          50,
          160,
          {
            align: "center",
          }
        );

      // Receipt details box
      const boxTop = 200;
      doc.rect(50, boxTop, 500, 120).stroke();

      // Receipt information
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Receipt Number:", 70, boxTop + 20)
        .font("Helvetica")
        .text(receiptData.receiptNumber, 200, boxTop + 20);

      doc
        .font("Helvetica-Bold")
        .text("Date Issued:", 70, boxTop + 40)
        .font("Helvetica")
        .text(new Date().toLocaleDateString("en-CA"), 200, boxTop + 40);

      doc
        .font("Helvetica-Bold")
        .text("Tax Year:", 70, boxTop + 60)
        .font("Helvetica")
        .text(receiptData.year.toString(), 200, boxTop + 60);

      doc
        .font("Helvetica-Bold")
        .text("Total Eligible Amount:", 70, boxTop + 80)
        .font("Helvetica")
        .text(`$${receiptData.totalAmount.toFixed(2)} CAD`, 200, boxTop + 80);

      // Donor information
      const donorBoxTop = 340;
      doc.rect(50, donorBoxTop, 500, 100).stroke();

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Donor Information", 70, donorBoxTop + 15);

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Name:", 70, donorBoxTop + 40)
        .font("Helvetica")
        .text(receiptData.donor.name, 120, donorBoxTop + 40);

      doc
        .font("Helvetica-Bold")
        .text("Address:", 70, donorBoxTop + 60)
        .font("Helvetica")
        .text(
          receiptData.donor.address || "Address not provided",
          120,
          donorBoxTop + 60
        );

      // Donations table
      const tableTop = 460;
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Donation Details", 50, tableTop);

      // Table headers
      const headerY = tableTop + 30;
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Date", 50, headerY)
        .text("Type", 150, headerY)
        .text("Amount", 250, headerY)
        .text("Currency", 320, headerY)
        .text("Transaction ID", 400, headerY);

      // Draw header line
      doc
        .moveTo(50, headerY + 15)
        .lineTo(550, headerY + 15)
        .stroke();

      // Table rows
      let currentY = headerY + 25;
      receiptData.donations.forEach((donation, index) => {
        doc
          .fontSize(9)
          .font("Helvetica")
          .text(
            new Date(donation.date).toLocaleDateString("en-CA"),
            50,
            currentY
          )
          .text(
            donation.type.charAt(0).toUpperCase() + donation.type.slice(1),
            150,
            currentY
          )
          .text(`$${donation.amount.toFixed(2)}`, 250, currentY)
          .text(donation.currency, 320, currentY)
          .text(donation.transactionId.substring(0, 20) + "...", 400, currentY);

        currentY += 20;

        // Add page break if needed
        if (currentY > 700 && index < receiptData.donations.length - 1) {
          doc.addPage();
          currentY = 50;
        }
      });

      // Footer with legal text
      const footerY = Math.max(currentY + 40, 650);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          "This official donation receipt is issued for income tax purposes. " +
            "No goods or services were provided in return for this donation. " +
            "This receipt contains information that is required for income tax purposes.",
          50,
          footerY,
          { width: 500, align: "justify" }
        );

      // Signature line
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          "Authorized Signature: _________________________",
          50,
          footerY + 60
        )
        .text("Date: _________________________", 350, footerY + 60);

      // Finalize the PDF
      doc.end();

      // Wait for the PDF to be written
      doc.on("end", () => {
        log("INFO", "PDF receipt generated successfully", {
          filename,
          filepath,
          donorId: receiptData.donor._id,
        });
        resolve(`/uploads/receipts/${filename}`);
      });

      doc.on("error", (error) => {
        log("ERROR", "Error generating PDF receipt:", error);
        reject(error);
      });
    } catch (error) {
      log("ERROR", "Error in generateReceiptPDF:", error);
      reject(error);
    }
  });
};

export const generateReceiptNumber = (
  year: number,
  donorId: string
): string => {
  const timestamp = Date.now();
  const donorHash = donorId.substring(donorId.length - 6);
  return `JKVIS-${year}-${donorHash}-${timestamp}`;
};

export const calculateEligibleAmount = (donations: IDonation[]): number => {
  // All donations are eligible for tax receipts in this system
  // In a real system, you might have different rules
  return donations.reduce((total, donation) => {
    if (donation.status === "completed") {
      return total + donation.amount;
    }
    return total;
  }, 0);
};
