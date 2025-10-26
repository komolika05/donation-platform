import api from "./api";
import type { CaseReport, Pagination } from "@/types";

interface PendingReportsResponse {
  reports: CaseReport[];
  pagination: Pagination;
}

/**
 * Fetches pending case reports from the API.
 * @param page - The page number to fetch.
 * @param limit - The number of reports per page.
 * @returns A promise that resolves to the pending reports and pagination info.
 */
export const fetchPendingReports = async (
  page = 1,
  limit = 10
): Promise<PendingReportsResponse> => {
  try {
    const response = await api.get(
      `/reports/pending?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch pending reports:", error);
    // The interceptor in api-client.ts will show a toast
    throw error;
  }
};

/**
 * Reviews a case report by approving or rejecting it.
 * @param caseId - The ID of the case report to review.
 * @param action - The action to take ('approve' or 'reject').
 * @param reviewNotes - Optional notes, especially for rejection.
 * @returns A promise that resolves to the updated case report.
 */
export const reviewCaseReport = async (
  caseId: string,
  action: "approve" | "reject",
  reviewNotes?: string
): Promise<CaseReport> => {
  try {
    const response = await api.put(`/reports/review/${caseId}`, {
      action,
      reviewNotes,
    });
    return response.data.data.caseReport;
  } catch (error) {
    console.error(`Failed to ${action} case report:`, error);
    // The interceptor in api-client.ts will show a toast
    throw error;
  }
};
