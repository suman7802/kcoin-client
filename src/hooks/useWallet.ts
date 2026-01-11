"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  createTransaction,
  getTransactionHistory,
  getTransactionSummary,
  getTransactionsByStatus,
  getWallet,
  getPendingBalance,
} from "@/lib/api/transactions";
import type { CreateTransactionRequest } from "@/lib/types/api";
import { toast } from "sonner";

/**
 * Hook to get wallet information
 * @param enabled - Whether the query should be enabled (default: true)
 */
export function useWallet(enabled: boolean = true) {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => getWallet(),
    enabled,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized) - user is not authenticated
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      // Retry once for other errors (network issues, 500, etc.)
      return failureCount < 1;
    },
    // Only refetch on window focus if query is enabled
    refetchOnWindowFocus: enabled,
  });
}

/**
 * Hook to get pending balance
 */
export function usePendingBalance() {
  return useQuery({
    queryKey: ["pending-balance"],
    queryFn: () => getPendingBalance(),
  });
}

/**
 * Hook to get transaction summary
 */
export function useTransactionSummary() {
  return useQuery({
    queryKey: ["transaction-summary"],
    queryFn: () => getTransactionSummary(),
  });
}

/**
 * Hook to get transactions by status
 */
export function useTransactionsByStatus(
  status: "pending" | "confirmed",
  limit?: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["transactions", status, limit],
    queryFn: () => getTransactionsByStatus(status, limit),
    enabled,
  });
}

/**
 * Hook to get transaction history with pagination
 */
export function useTransactionHistory(
  status: "pending" | "confirmed",
  offset: number = 0,
  limit: number = 10,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["transaction-history", status, offset, limit],
    queryFn: () => getTransactionHistory(status, offset, limit),
    enabled,
  });
}

/**
 * Hook to create a transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => createTransaction(data),
    onSuccess: (data) => {
      toast.success(data.message || "Transaction created successfully!");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["pending-balance"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-history"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create transaction");
    },
  });
}
