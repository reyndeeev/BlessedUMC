// Temporary comment for deployment trigger: Copilot debug push

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  token?: string;
}

const TOKEN_KEY = "blessedumc_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check current authentication status
  const { data: authData, isLoading, error, refetch } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = getToken();
      if (!token) {
        return { success: false, message: "No token" };
      }
      
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      
      // If authentication fails, clear the invalid token
      if (!response.ok || !data.success) {
        clearToken();
        return { success: false, message: data.message || "Authentication failed" };
      }
      
      return data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      console.log("Login attempt:", { username, passwordLength: password.length });
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      if (!response.ok || !data.success) {
        console.error("Login failed:", data.message);
        throw new Error(data.message || "Login failed");
      }
      console.log("Login successful, setting token");
      setToken(data.token);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      refetch(); // Force refetch the auth state immediately
      toast({
        title: "Login Successful",
        description: "You are now logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }
      setToken(data.token);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Registration Successful",
        description: "You are now registered and logged in.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      clearToken();
      // Optionally, call backend logout endpoint if needed
      // await fetch('/api/auth/logout', { method: 'POST' });
      return true;
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to logout properly",
        variant: "destructive",
      });
    },
  });

  const login = async (username: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
      loginMutation.mutate({ username, password }, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error)
      });
    });
  };

  const register = (username: string, password: string) => {
    registerMutation.mutate({ username, password });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: authData?.user,
    isAuthenticated: !!authData?.success && !!authData?.user,
    isLoading,
    isError: !!error,
    login,
    register,
    logout,
    isLoggingOut: logoutMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}