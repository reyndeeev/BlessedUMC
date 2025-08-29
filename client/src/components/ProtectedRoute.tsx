import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Lock, AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("blessedumc_token");
      
      if (!token) {
        setIsAuthenticated(false);
        setLocation("/login");
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          setIsAuthenticated(result.success && result.user);
        } else {
          localStorage.removeItem("blessedumc_token");
          setIsAuthenticated(false);
          setLocation("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("blessedumc_token");
        setIsAuthenticated(false);
        setLocation("/login");
      }
    };

    checkAuth();
  }, [setLocation]);

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-methodist-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }


  // Show unauthorized state
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">
            You need to login to access the dashboard.
          </p>
          <Button 
            onClick={() => setLocation("/login")}
            className="bg-methodist-blue hover:bg-methodist-blue/90"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}