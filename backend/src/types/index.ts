import type { Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  address?: string
  country?: string
  role: "donor" | "hospital-admin" | "super-admin"
  isEmailVerified: boolean
  createdAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

export interface IDonation extends Document {
  donor: string
  amount: number
  currency: "USD" | "CAD"
  type: "sponsorship" | "20kids20" | "general"
  caseReport?: string
  paymentMethod: string
  transactionId: string
  date: Date
  status: "pending" | "completed" | "failed"
}

export interface ICaseReport extends Document {
  title: string
  description?: string
  cost: number
  fundType: "sponsorship" | "20kids20"
  photoUrl: string
  uploadedBy: string
  status: "pending" | "approved" | "rejected" | "assigned"
  donor?: string
  createdAt: Date
}

export interface IReceipt extends Document {
  donor: string
  donations: string[]
  totalAmount: number
  year: number
  craCompliantData: {
    donorName: string
    donorAddress: string
    receiptNumber: string
    donationDate: string
    eligibleAmount: number
    organizationName: string
    organizationAddress: string
    organizationRegistrationNumber: string
  }
  pdfUrl?: string
  issuedAt: Date
  receiptNumber: string
}

export interface AuthRequest extends Request {
  user?: IUser
}
