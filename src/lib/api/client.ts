import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/lib/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v0';

/**
 * Create axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for cookie-based auth
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - can be used to add auth tokens if needed
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Cookies are automatically sent with withCredentials: true
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

/**
 * Response interceptor - handle errors globally
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<ApiResponse<null>>) => {
        // Handle error responses
        if (error.response) {
            const { status, data } = error.response;

            // For 401 Unauthorized, we preserve the original AxiosError
            // so that React Query and AuthContext can properly handle it
            // (disable retries, update auth state, etc.)
            // The redirect is handled by AuthContext/React components, not here
            if (status === 401) {
                // Preserve the original AxiosError with response info
                // so consumers can check error.response.status
                error.message = data?.message || 'Unauthorized';
                return Promise.reject(error);
            }

            // Return error with message from API if available
            const errorMessage = data?.message || error.message || 'An error occurred';
            return Promise.reject(new Error(errorMessage));
        }

        // Network error or other issues
        return Promise.reject(new Error(error.message || 'Network error. Please check your connection.'));
    },
);
