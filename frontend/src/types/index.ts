export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  country?: string;
  role: "donor" | "hospital-admin" | "super-admin";
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Donation {
  id: string;
  donor: string | User;
  amount: number;
  currency: "USD" | "CAD";
  type: "sponsorship" | "20kids20" | "general";
  caseReport?: string | CaseReport;
  paymentMethod: string;
  transactionId: string;
  date: string;
  status: "pending" | "completed" | "failed";
}

export interface CaseReport {
  id: string;
  title: string;
  description?: string;
  cost: number;
  fundType: "sponsorship" | "20kids20";
  photoUrl: string;
  uploadedBy: string | User;
  status: "pending" | "approved" | "rejected" | "assigned";
  donor?: string | User;
  createdAt: string;
}

export interface Receipt {
  id: string;
  donor: string | User;
  donations: string[] | Donation[];
  totalAmount: number;
  year: number;
  craCompliantData: {
    donorName: string;
    donorAddress: string;
    receiptNumber: string;
    donationDate: string;
    eligibleAmount: number;
    organizationName: string;
    organizationAddress: string;
    organizationRegistrationNumber: string;
  };
  pdfUrl?: string;
  issuedAt: string;
  receiptNumber: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "donor" | "hospital-admin";
  phone: string;
  address: string;
  hospitalName?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}
