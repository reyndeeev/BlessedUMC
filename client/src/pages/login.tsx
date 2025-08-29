import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
// import { useAuth } from "@/hooks/useAuth"; // Removed to prevent conflicts
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Church } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    console.log("Form submitted with:", { username: data.username, passwordLength: data.password.length });
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.username, password: data.password }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }
      
      // Store token and redirect
      localStorage.setItem("blessedumc_token", result.token);
      console.log("Login successful, redirecting to dashboard");
      
      // Use replace to prevent back button issues
      window.location.replace("/bumcdashboard");
      
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("blessedumc_token");
    if (token) {
      // Verify token is still valid
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.ok) {
          window.location.replace("/bumcdashboard");
        } else {
          localStorage.removeItem("blessedumc_token");
        }
      }).catch(() => {
        localStorage.removeItem("blessedumc_token");
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-methodist-red/10 to-methodist-blue/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-methodist-blue rounded-full flex items-center justify-center mb-4">
            <Church className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Blessed United Methodist Church</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            {...field} 
                            className="pl-10"
                            placeholder="Enter your username"
                            data-testid="input-login-username"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            {...field} 
                            type="password"
                            className="pl-10"
                            placeholder="Enter your password"
                            data-testid="input-login-password"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-methodist-blue hover:bg-methodist-blue/90"
                  disabled={isLoading}
                  data-testid="button-login-submit"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Blessed United Methodist Church
          </p>
        </div>
      </div>
    </div>
  );
}