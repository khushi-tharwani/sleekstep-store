
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  adminOnly = false
}) => {
  const { isAuthenticated, isLoading, hasPermission, isAdmin } = useAuth();
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "You need to login to access this page",
          variant: "destructive",
        });
        setShouldRedirect(true);
      } else if (adminOnly && !isAdmin) {
        toast({
          title: "Admin Access Denied",
          description: "You need admin privileges to access this page",
          variant: "destructive",
        });
        setShouldRedirect(true);
      } else if (requiredPermission && !hasPermission(requiredPermission)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        setShouldRedirect(true);
      }
    }
  }, [isAuthenticated, isLoading, requiredPermission, hasPermission, adminOnly, isAdmin, toast]);

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated or doesn't have permission, redirect to login with return URL
  if (shouldRedirect) {
    // Redirect to admin login if trying to access admin page
    if (adminOnly) {
      return <Navigate to={`/admin-login?returnUrl=${encodeURIComponent(location.pathname)}`} />;
    }
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} />;
  }

  // If authenticated (and has required permission if specified), render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
