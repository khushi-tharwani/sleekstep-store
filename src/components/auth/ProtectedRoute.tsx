
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
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
      } else if (requiredPermission && !hasPermission(requiredPermission)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        setShouldRedirect(true);
      }
    }
  }, [isAuthenticated, isLoading, requiredPermission, hasPermission, toast]);

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (shouldRedirect) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} />;
  }

  // If authenticated (and has required permission if specified), render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
