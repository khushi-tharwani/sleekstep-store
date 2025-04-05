
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated && isAdmin) {
      navigate("/admin");
    } else if (!authLoading && isAuthenticated && !isAdmin) {
      toast.error("You don't have admin privileges");
      navigate("/");
    }
  }, [isAuthenticated, authLoading, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password, true);
      // Navigation will happen in useEffect
    } catch (error) {
      // Error is handled in the login function via toast
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (isAuthenticated && isAdmin)) {
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
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Admin Login</h1>
              <p className="text-gray-400 mt-2">Sign in to your admin account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-400">
              Need an admin account?{" "}
              <Link to="/admin-signup" className="text-primary hover:underline">
                Create admin account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
