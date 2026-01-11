"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { AxiosError } from "axios";
import { useWallet } from "@/hooks/useWallet";
import { useAuth as useAuthMutations } from "@/hooks/useAuth";

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
  // Track if wallet query should be enabled
  // Starts as true for initial auth check, disabled on 401 or logout
  const [queryEnabled, setQueryEnabled] = useState(true);

  // Stable callbacks using refs to avoid re-creating the options object
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
    [onLoginSuccess, onLogoutSuccess]
  );

  const {
    login: loginMutate,
    register: registerMutate,
    logout: logoutMutate,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
  } = useAuthMutations(authOptions);

  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    isFetching,
  } = useWallet(queryEnabled);

  // Disable query on 401 errors to prevent continuous calls
  useEffect(() => {
    if (
      walletError instanceof AxiosError &&
      walletError.response?.status === 401
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQueryEnabled(false);
    }
  }, [walletError]);

  // Derive authentication status from wallet query state
  const isAuthenticated = useMemo(() => {
    // If query is disabled due to 401, user is not authenticated
    if (!queryEnabled && walletError) {
      return false;
    }

    // During loading, maintain previous state (false if no data)
    if (walletLoading) {
      return false;
    }

    // Check if we have valid wallet data
    return !!walletData?.data;
  }, [walletData, walletError, walletLoading, queryEnabled]);

  // Derive wallet address from wallet data
  const walletAddress = useMemo(() => {
    return walletData?.data?.walletAddress ?? null;
  }, [walletData]);

  // Login handler - just calls the mutation, query is re-enabled via callback on success
  const login = useCallback(
    (username: string, password: string) => {
      loginMutate({ username, password });
    },
    [loginMutate]
  );

  const register = useCallback(
    (username: string, password: string) => {
      registerMutate({ username, password });
    },
    [registerMutate]
  );

  // Logout handler - query is disabled via callback on success
  const logout = useCallback(() => {
    logoutMutate();
  }, [logoutMutate]);

  // Overall loading state - true during initial auth check
  const isLoading = walletLoading || (isFetching && queryEnabled);

  // Memoize the context value to prevent unnecessary re-renders
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
    [
      isAuthenticated,
      walletAddress,
      isLoading,
      isLoggingIn,
      isRegistering,
      isLoggingOut,
      login,
      register,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
