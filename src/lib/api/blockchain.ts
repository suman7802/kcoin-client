import { apiClient } from './client';
import type { MineBlockResponse, GetChainResponse } from '@/lib/types/api';

/**
 * Mine a new block
 */
export const mineBlock = async (): Promise<MineBlockResponse> => {
    const response = await apiClient.get<MineBlockResponse>('/crypto/mine');
    return response.data;
};

/**
 * Get blockchain with optional filters and pagination
 */
export const getChain = async (options?: {
    hash?: string;
    date?: string; // Format: "YYYY-MM-DD"
    offset?: number;
    limit?: number;
}): Promise<GetChainResponse> => {
    const params = new URLSearchParams();

    if (options?.hash) {
        params.append('hash', options.hash);
    }
    if (options?.date) {
        params.append('date', options.date);
    }
    if (options?.offset !== undefined) {
        params.append('offset', options.offset.toString());
    }
    if (options?.limit !== undefined) {
        params.append('limit', options.limit.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/crypto/chain?${queryString}` : '/crypto/chain';

    const response = await apiClient.get<GetChainResponse>(url);
    return response.data;
};
