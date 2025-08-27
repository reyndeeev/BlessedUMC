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
}

export function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check current authentication status
  const { data: authData, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      // Redirect will be handled by the component using this hook
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to logout properly",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: authData?.user,
    isAuthenticated: !!authData?.success && !!authData?.user,
    isLoading,
    isError: !!error,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}