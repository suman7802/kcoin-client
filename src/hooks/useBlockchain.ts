'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mineBlock, getChain } from '@/lib/api/blockchain';
import { toast } from 'sonner';

/**
 * Hook to mine a block
 */
export function useMineBlock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => mineBlock(),
        onSuccess: (data) => {
            toast.success(data.message || 'Block mined successfully!');
            queryClient.invalidateQueries({ queryKey: ['blockchain'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['transaction-history'] });
            queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to mine block');
        },
    });
}

/**
 * Hook to get blockchain with filters
 */
export function useBlockchain(
    options?: {
        hash?: string;
        date?: string;
        offset?: number;
        limit?: number;
    },
    enabled: boolean = true,
) {
    return useQuery({
        queryKey: ['blockchain', options],
        queryFn: () => getChain(options),
        enabled,
    });
}
