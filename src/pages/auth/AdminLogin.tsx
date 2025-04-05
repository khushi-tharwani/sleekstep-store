
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { LogIn, Shield } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Use useEffect to handle redirects based on authentication state
  // This fixes the infinite render loop by moving redirects out of render phase
  useEffect(() => {
    if (!authLoading) {
      // If already authenticated as admin, redirect to admin products
      if (isAuthenticated && isAdmin) {
        navigate("/admin/products");
      }
      // If authenticated but not admin, show error toast and redirect
      else if (isAuthenticated && !isAdmin) {
        toast("Access Denied", {
          description: "This login is only for administrators",
          position: "top-center"
        });
        navigate("/");
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password, true); // Added third parameter to check for admin
    } catch (error) {
      // Error is handled in the login function via toast
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form if we're authenticated and/or redirecting
  if (authLoading || (isAuthenticated && (isAdmin || !isAdmin))) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-dark-100 p-8 rounded-lg border border-white/10 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Admin Login</h1>
              <p className="text-gray-400 mt-2">Sign in to access admin dashboard</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-dark-200 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-dark-200 border-white/10"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in as Admin"}
              </Button>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-400">
              Not an admin?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Regular login
              </Link>
            </p>
            
            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-gray-500 text-center">
              <p>For demo purposes, use admin account:</p>
              <p className="mt-1">Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
