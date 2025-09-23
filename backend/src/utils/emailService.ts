import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import logger from "./logger";
import type { IUser, IReceipt } from "../types";

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env["EMAIL_HOST"] || "smtp.gmail.com",
    port: Number.parseInt(process.env["EMAIL_PORT"] || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env["EMAIL_USER"],
      pass: process.env["EMAIL_PASS"],
    },
  });
};

export const sendReceiptEmail = async (
  user: IUser,
  receipt: IReceipt,
  pdfPath: string
): Promise<void> => {
  try {
    logger.info("Sending receipt email", {
      userId: user._id,
      email: user.email,
      receiptNumber: receipt.receiptNumber,
      year: receipt.year,
    });

    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();
    logger.info("Email transporter verified successfully");

    // Read PDF file
    const pdfBuffer = fs.readFileSync(path.join(__dirname, "../..", pdfPath));

    const mailOptions = {
      from: {
        name: process.env["ORG_NAME"] || "JKVIS Foundation",
        address: process.env["EMAIL_FROM"] || process.env["EMAIL_USER"]!,
      },
      to: {
        name: user.name,
        address: user.email,
      },
      subject: `Your ${receipt.year} Tax Receipt - ${receipt.receiptNumber}`,
      html: generateReceiptEmailHTML(user, receipt),
      attachments: [
        {
          filename: `JKVIS-Tax-Receipt-${receipt.year}-${receipt.receiptNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info("Receipt email sent successfully", {
      userId: user._id,
      email: user.email,
      messageId: info.messageId,
      receiptNumber: receipt.receiptNumber,
    });
  } catch (error) {
    logger.error("Error sending receipt email:", {
      error,
      userId: user._id,
      email: user.email,
      receiptNumber: receipt.receiptNumber,
    });
    throw error;
  }
};

const generateReceiptEmailHTML = (user: IUser, receipt: IReceipt): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Tax Receipt</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #2563eb;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                background-color: #f8fafc;
                padding: 30px;
                border-radius: 0 0 8px 8px;
            }
            .receipt-details {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #2563eb;
            }
            .amount {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                font-size: 14px;
                color: #64748b;
            }
            .button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${process.env["ORG_NAME"] || "JKVIS Foundation"}</h1>
            <p>Official Tax Receipt for ${receipt.year}</p>
        </div>
        
        <div class="content">
            <h2>Dear ${user.name},</h2>
            
            <p>Thank you for your generous donations to ${
              process.env["ORG_NAME"] || "JKVIS Foundation"
            } during ${
    receipt.year
  }. Your support makes a real difference in the lives of those we serve.</p>
            
            <div class="receipt-details">
                <h3>Receipt Details</h3>
                <p><strong>Receipt Number:</strong> ${receipt.receiptNumber}</p>
                <p><strong>Tax Year:</strong> ${receipt.year}</p>
                <p><strong>Date Issued:</strong> ${new Date(
                  receipt.issuedAt
                ).toLocaleDateString("en-CA")}</p>
                <p><strong>Number of Donations:</strong> ${
                  receipt.donations.length
                }</p>
                
                <div class="amount">
                    Total Eligible Amount: $${receipt.totalAmount.toFixed(
                      2
                    )} CAD
                </div>
            </div>
            
            <p>Your official tax receipt is attached to this email as a PDF document. Please save this receipt for your tax records, as it contains all the information required by the Canada Revenue Agency.</p>
            
            <p><strong>Important:</strong> This receipt is issued for income tax purposes. No goods or services were provided in return for your donations.</p>
            
            <div class="footer">
                <p>If you have any questions about your receipt or our organization, please don't hesitate to contact us:</p>
                <p>
                    <strong>${
                      process.env["ORG_NAME"] || "JKVIS Foundation"
                    }</strong><br>
                    ${
                      process.env["ORG_ADDRESS"] ||
                      "123 Charity Street, Toronto, ON, M1A 1A1"
                    }<br>
                    Phone: ${process.env["ORG_PHONE"] || "+1-416-555-0123"}<br>
                    Email: ${process.env["ORG_EMAIL"] || "info@jkvis.org"}<br>
                    Registration Number: ${
                      process.env["ORG_REGISTRATION_NUMBER"] ||
                      "123456789RR0001"
                    }
                </p>
                
                <p>Thank you again for your continued support!</p>
                
                <p><em>This email was sent automatically. Please do not reply to this email address.</em></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const sendWelcomeEmail = async (user: IUser): Promise<void> => {
  try {
    logger.info("Sending welcome email", {
      userId: user._id,
      email: user.email,
    });

    const transporter = createTransporter();
    await transporter.verify();

    const mailOptions = {
      from: {
        name: process.env["ORG_NAME"] || "JKVIS Foundation",
        address: process.env["EMAIL_FROM"] || process.env["EMAIL_USER"]!,
      },
      to: {
        name: user.name,
        address: user.email,
      },
      subject: `Welcome to ${process.env["ORG_NAME"] || "JKVIS Foundation"}!`,
      html: generateWelcomeEmailHTML(user),
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info("Welcome email sent successfully", {
      userId: user._id,
      email: user.email,
      messageId: info.messageId,
    });
  } catch (error) {
    logger.error("Error sending welcome email:", {
      error,
      userId: user._id,
      email: user.email,
    });
    // Don't throw error for welcome emails - they're not critical
  }
};

const generateWelcomeEmailHTML = (user: IUser): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to JKVIS</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #2563eb;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }
            .content {
                background-color: #f8fafc;
                padding: 30px;
                border-radius: 0 0 8px 8px;
            }
            .button {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Welcome to ${
              process.env["ORG_NAME"] || "JKVIS Foundation"
            }!</h1>
        </div>
        
        <div class="content">
            <h2>Dear ${user.name},</h2>
            
            <p>Thank you for joining our mission to make a positive impact in the world. Your account has been successfully created, and you're now part of our community of compassionate supporters.</p>
            
            <p>As a registered ${
              user.role === "donor" ? "donor" : user.role.replace("-", " ")
            }, you can:</p>
            
            <ul>
                ${
                  user.role === "donor"
                    ? `
                <li>Make secure donations to support our causes</li>
                <li>Track your donation history and impact</li>
                <li>Receive automated tax receipts</li>
                <li>View case reports of sponsored projects</li>
                `
                    : user.role === "hospital-admin"
                    ? `
                <li>Upload case reports with photos</li>
                <li>Track the status of your submissions</li>
                <li>Manage your hospital's cases</li>
                `
                    : `
                <li>Review and approve case reports</li>
                <li>Manage users and donations</li>
                <li>Access comprehensive analytics</li>
                <li>Monitor system health</li>
                `
                }
            </ul>
            
            <p>We're excited to have you on board and look forward to working together to create positive change.</p>
            
            <p>If you have any questions or need assistance, please don't hesitate to reach out to us at ${
              process.env["ORG_EMAIL"] || "info@jkvis.org"
            }.</p>
            
            <p>Thank you for your commitment to making a difference!</p>
            
            <p>Best regards,<br>The ${
              process.env["ORG_NAME"] || "JKVIS Foundation"
            } Team</p>
        </div>
    </body>
    </html>
  `;
};
