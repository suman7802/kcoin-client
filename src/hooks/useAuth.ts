'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, logout, register } from '@/lib/api/auth';
import type { LoginRequest, RegisterRequest } from '@/lib/types/api';
import { toast } from 'sonner';

interface UseAuthOptions {
    onLoginSuccess?: () => void;
    onLogoutSuccess?: () => void;
}

/**
 * Hook for authentication mutations
 */
export function useAuth(options?: UseAuthOptions) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const registerMutation = useMutation({
        mutationFn: (data: RegisterRequest) => register(data),
        onSuccess: (data) => {
            toast.success(data.message || 'Registration successful!');
            router.push('/login');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Registration failed');
        },
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: (data) => {
            toast.success(data.message || 'Login successful!');
            // Call the callback to re-enable queries BEFORE invalidating
            options?.onLoginSuccess?.();
            // Invalidate and refetch user-related queries
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['transaction-summary'] });
            router.push('/dashboard');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Login failed');
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            toast.success('Logged out successfully');
            // Call callback first, then clear cache
            options?.onLogoutSuccess?.();
            queryClient.clear();
            router.push('/login');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Logout failed');
        },
    });

    return {
        register: registerMutation.mutate,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isRegistering: registerMutation.isPending,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
    };
}
