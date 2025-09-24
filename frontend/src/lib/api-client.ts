import api from "./api";
import type { Donation, Case, DashboardStats } from "@/types";

export const donationApi = {
  // Get user's donations
  getUserDonations: async (): Promise<Donation[]> => {
    const response = await api.get("/donations/user");
    return response.data.data || [];
  },

  // Get all donations (admin only)
  getAllDonations: async (): Promise<Donation[]> => {
    const response = await api.get("/donations");
    return response.data.data || [];
  },

  // Create a new donation
  createDonation: async (donationData: any): Promise<Donation> => {
    const response = await api.post("/donations", donationData);
    return response.data.data;
  },
};

export const caseApi = {
  // Get all active cases
  getActiveCases: async (): Promise<Case[]> => {
    const response = await api.get("/cases?status=active");
    return response.data.data || [];
  },

  // Get all cases (admin only)
  getAllCases: async (): Promise<Case[]> => {
    const response = await api.get("/cases");
    return response.data.data || [];
  },

  // Create a new case (admin only)
  createCase: async (caseData: Partial<Case>): Promise<Case> => {
    const response = await api.post("/cases", caseData);
    return response.data.data;
  },

  // Update a case (admin only)
  updateCase: async (
    caseId: string,
    caseData: Partial<Case>
  ): Promise<Case> => {
    const response = await api.put(`/cases/${caseId}`, caseData);
    return response.data.data;
  },

  // Delete a case (admin only)
  deleteCase: async (caseId: string): Promise<void> => {
    await api.delete(`/cases/${caseId}`);
  },
};

export const dashboardApi = {
  // Get donor dashboard stats
  getDonorStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/donor");
    return response.data.data;
  },

  // Get admin dashboard stats
  getAdminStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard/admin");
    return response.data.data;
  },
};

// Mock data for development
export const mockData = {
  donations: [
    {
      _id: "1",
      donorId: "user1",
      donorName: "John Doe",
      donorEmail: "john@example.com",
      amount: 500,
      currency: "USD",
      type: "sponsorship" as const,
      caseId: "case1",
      caseName: "Heart Surgery for Sarah",
      transactionId: "TXN-123456",
      paymentMethod: "stripe",
      status: "completed" as const,
      receiptUrl: "/receipts/receipt-1.pdf",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      _id: "2",
      donorId: "user1",
      donorName: "John Doe",
      donorEmail: "john@example.com",
      amount: 250,
      currency: "USD",
      type: "general" as const,
      transactionId: "TXN-123457",
      paymentMethod: "paypal",
      status: "completed" as const,
      receiptUrl: "/receipts/receipt-2.pdf",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
    },
  ],
  cases: [
    {
      _id: "case1",
      title: "Heart Surgery for Sarah",
      description:
        "Sarah, a 8-year-old girl, needs urgent heart surgery to save her life. The family cannot afford the medical expenses and is seeking community support for this critical procedure.",
      cost: 15000,
      currency: "USD",
      photoUrl: "/young-girl-hospital.jpg",
      hospitalId: "hospital1",
      hospitalName: "City General Hospital",
      status: "active" as const,
      raisedAmount: 8500,
      donationsCount: 12,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      _id: "case2",
      title: "Cancer Treatment for Michael",
      description:
        "Michael, a 45-year-old father of two, needs chemotherapy treatment for his recent cancer diagnosis. The treatment costs are overwhelming for the family.",
      cost: 25000,
      currency: "USD",
      photoUrl: "/middle-aged-man-hospital.jpg",
      hospitalId: "hospital1",
      hospitalName: "City General Hospital",
      status: "active" as const,
      raisedAmount: 12000,
      donationsCount: 18,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-14"),
    },
    {
      _id: "case3",
      title: "Emergency Surgery for Emma",
      description:
        "Emma needs emergency surgery after a car accident. The family needs financial support for the medical bills and ongoing rehabilitation costs.",
      cost: 8000,
      currency: "USD",
      photoUrl: "/young-woman-hospital-emergency.jpg",
      hospitalId: "hospital1",
      hospitalName: "City General Hospital",
      status: "completed" as const,
      raisedAmount: 8000,
      donationsCount: 25,
      createdAt: new Date("2023-12-20"),
      updatedAt: new Date("2024-01-05"),
    },
  ],
  donorStats: {
    totalDonations: 2,
    totalAmount: 750,
    totalCases: 1,
    activeCases: 1,
    completedCases: 0,
    recentDonations: [],
  },
  adminStats: {
    totalDonations: 55,
    totalAmount: 125000,
    totalCases: 15,
    activeCases: 8,
    completedCases: 7,
    recentDonations: [],
  },
};
