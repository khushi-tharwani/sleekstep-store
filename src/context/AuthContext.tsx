
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize auth state and set up listener for auth changes
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Transform Supabase user to our User type
          const newUser: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: currentSession.user.user_metadata.name || '',
            role: currentSession.user.user_metadata.role || 'user',
            avatar: currentSession.user.user_metadata.avatar || undefined
          };
          setUser(newUser);
          
          // After setting user data, fetch additional user permissions if needed
          setTimeout(() => {
            fetchUserDetails(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }

        // If there's a logout event, clear any stale user data
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Transform Supabase user to our User type
        const newUser: User = {
          id: currentSession.user.id,
          email: currentSession.user.email || '',
          name: currentSession.user.user_metadata.name || '',
          role: currentSession.user.user_metadata.role || 'user',
          avatar: currentSession.user.user_metadata.avatar || undefined
        };
        setUser(newUser);
        
        // After setting user data, fetch additional user details
        setTimeout(() => {
          fetchUserDetails(currentSession.user.id);
        }, 0);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Update user with additional profile data
        setUser(prev => prev ? {
          ...prev,
          role: data.role || prev.role,
          avatar: data.avatar_url || prev.avatar,
          name: data.name || prev.name
        } : null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // User data will be set by the onAuthStateChange listener
      toast({
        title: "Login successful!",
        description: "Welcome back to SleekStep.",
      });
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
          }
        }
      });
      
      if (error) throw error;
      
      // User data will be set by the onAuthStateChange listener
      toast({
        title: "Registration successful!",
        description: "Welcome to SleekStep.",
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error.message || "This email might already be in use.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Add more granular permission checks here based on your app's needs
    // For example, map specific permissions to specific roles
    const permissionMap: Record<string, string[]> = {
      'view:orders': ['user', 'admin'],
      'manage:products': ['admin'],
    };
    
    return permissionMap[permission]?.includes(user.role) || false;
  };

  const isAuthenticated = !!user && !!session;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        isAdmin,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
