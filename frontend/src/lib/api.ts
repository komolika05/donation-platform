import {
  DashboardStats,
  DonationPayload,
  MyDonationsResponse,
  PublicCasesResponse,
} from "@/types";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jkvis_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "An error occurred";

    // Don't show toast for certain endpoints
    const silentEndpoints = ["/auth/me"];
    const isSilentEndpoint = silentEndpoints.some((endpoint) =>
      error.config?.url?.includes(endpoint)
    );

    if (!isSilentEndpoint) {
      toast.error(message);
    }

    // Redirect to login if unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("jkvis_token");
      localStorage.removeItem("jkvis_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const fetchPublicCases = async (
  page = 1,
  limit = 9
): Promise<PublicCasesResponse> => {
  try {
    const response = await api.get(`/reports/public`, {
      params: { page, limit },
    });
    // Ensure you return the nested data object
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch public cases:", error);
    // The interceptor will handle the toast
    throw error;
  }
};

export const recordDonation = async (donationData: DonationPayload) => {
  try {
    const response = await api.post("/donations/record", donationData);
    return response.data; // This will be { success: true, data: { donation: ... } }
  } catch (error) {
    console.error("Failed to record donation:", error);
    // The interceptor will handle the toast
    throw error;
  }
};

// Function to get the summary stats
export const fetchDashboardStats = async (): Promise<{
  data: DashboardStats;
}> => {
  try {
    const response = await api.get("/donations/dashboard-summary");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
};

// Function to get the list of user's donations
export const fetchMyDonations = async (
  page = 1,
  limit = 10
): Promise<{ data: MyDonationsResponse }> => {
  try {
    const response = await api.get("/donations/my-donations", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user donations:", error);
    throw error;
  }
};

export default api;
