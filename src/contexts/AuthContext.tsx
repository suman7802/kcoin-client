'use client';

import { createContext, useContext, ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useWallet } from '@/hooks/useWallet';
import { useAuth as useAuthMutations } from '@/hooks/useAuth';

interface AuthContextType {
    isAuthenticated: boolean;
    walletAddress: string | null;
    isLoading: boolean;
    isLoggingIn: boolean;
    isRegistering: boolean;
    isLoggingOut: boolean;
    login: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [queryEnabled, setQueryEnabled] = useState(true);

    const onLoginSuccess = useCallback(() => {
        setQueryEnabled(true);
    }, []);

    const onLogoutSuccess = useCallback(() => {
        setQueryEnabled(false);
    }, []);

    const authOptions = useMemo(
        () => ({
            onLoginSuccess,
            onLogoutSuccess,
        }),
        [onLoginSuccess, onLogoutSuccess],
    );

    const {
        login: loginMutate,
        register: registerMutate,
        logout: logoutMutate,
        isLoggingIn,
        isRegistering,
        isLoggingOut,
    } = useAuthMutations(authOptions);

    const { data: walletData, isLoading: walletLoading, error: walletError, isFetching } = useWallet(queryEnabled);

    useEffect(() => {
        if (walletError instanceof AxiosError && walletError.response?.status === 401) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQueryEnabled(false);
        }
    }, [walletError]);

    const isAuthenticated = useMemo(() => {
        if (!queryEnabled && walletError) {
            return false;
        }

        if (walletLoading) {
            return false;
        }

        return !!walletData?.data;
    }, [walletData, walletError, walletLoading, queryEnabled]);

    const walletAddress = useMemo(() => {
        return walletData?.data?.walletAddress ?? null;
    }, [walletData]);

    const login = useCallback(
        (username: string, password: string) => {
            loginMutate({ username, password });
        },
        [loginMutate],
    );

    const register = useCallback(
        (username: string, password: string) => {
            registerMutate({ username, password });
        },
        [registerMutate],
    );

    const logout = useCallback(() => {
        logoutMutate();
    }, [logoutMutate]);

    const isLoading = walletLoading || (isFetching && queryEnabled);

    const contextValue = useMemo(
        () => ({
            isAuthenticated,
            walletAddress,
            isLoading,
            isLoggingIn,
            isRegistering,
            isLoggingOut,
            login,
            register,
            logout,
        }),
        [isAuthenticated, walletAddress, isLoading, isLoggingIn, isRegistering, isLoggingOut, login, register, logout],
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
