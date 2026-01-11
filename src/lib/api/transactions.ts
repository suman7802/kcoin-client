import { apiClient } from "./client";
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  GetWalletResponse,
  GetPendingBalanceResponse,
  GetTransactionsByStatusResponse,
  GetTransactionHistoryResponse,
  GetTransactionSummaryResponse,
} from "@/lib/types/api";

/**
 * Create a new transaction
 */
export const createTransaction = async (
  data: CreateTransactionRequest
): Promise<CreateTransactionResponse> => {
  const response = await apiClient.post<CreateTransactionResponse>(
    "/transaction",
    data
  );
  return response.data;
};

/**
 * Get wallet balance and address
 */
export const getWallet = async (): Promise<GetWalletResponse> => {
  const response = await apiClient.get<GetWalletResponse>("/transaction/wallet");
  return response.data;
};

/**
 * Get pending balance
 */
export const getPendingBalance = async (): Promise<GetPendingBalanceResponse> => {
  const response = await apiClient.get<GetPendingBalanceResponse>(
    "/transaction/pending/balance"
  );
  return response.data;
};

/**
 * Get transactions by status
 */
export const getTransactionsByStatus = async (
  status: "pending" | "confirmed",
  limit?: number
): Promise<GetTransactionsByStatusResponse> => {
  const params = new URLSearchParams();
  params.append("status", status);
  if (limit) {
    params.append("limit", limit.toString());
  }
  
  const response = await apiClient.get<GetTransactionsByStatusResponse>(
    `/transaction?${params.toString()}`
  );
  return response.data;
};

/**
 * Get transaction history with pagination
 */
export const getTransactionHistory = async (
  status: "pending" | "confirmed",
  offset: number = 0,
  limit: number = 10
): Promise<GetTransactionHistoryResponse> => {
  const params = new URLSearchParams();
  params.append("status", status);
  params.append("offset", offset.toString());
  params.append("limit", limit.toString());
  
  const response = await apiClient.get<GetTransactionHistoryResponse>(
    `/transaction/history?${params.toString()}`
  );
  return response.data;
};

/**
 * Get transaction summary
 */
export const getTransactionSummary = async (): Promise<GetTransactionSummaryResponse> => {
  const response = await apiClient.get<GetTransactionSummaryResponse>(
    "/transaction/summary"
  );
  return response.data;
};
