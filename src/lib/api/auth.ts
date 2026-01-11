import { apiClient } from './client';
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, LogoutResponse } from '@/lib/types/api';

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
};

/**
 * Login user
 * Sets HttpOnly cookie automatically via withCredentials
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/auth/logout');
    return response.data;
};
