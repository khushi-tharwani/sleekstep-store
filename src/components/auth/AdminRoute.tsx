
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "You need to login to access this page",
          variant: "destructive",
        });
        setShouldRedirect("/login");
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        setShouldRedirect("/");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, toast]);

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we need to redirect, do so
  if (shouldRedirect) {
    return <Navigate to={shouldRedirect} />;
  }

  // If admin, render the protected component
  return <>{children}</>;
};

export default AdminRoute;
