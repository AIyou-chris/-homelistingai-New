import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, login, logout, signup, resetPassword, updatePassword, isAdmin } from '../services/authService';
import { supabase, healthMonitor, SupabaseErrorHandler } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  isAuthenticated: boolean;
  error: string | null;
  connectionStatus: {
    isConnected: boolean;
    lastHealthCheck: Date;
    timeSinceLastCheck: number;
  };
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearError: () => void;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  forceHealthCheck: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Check if we're in demo mode
const isDemoMode = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return !supabaseUrl || !supabaseKey || supabaseUrl.includes('demo');
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState(healthMonitor.getConnectionStatus());

  // Monitor connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(healthMonitor.getConnectionStatus());
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
    
    // Add a safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.warn('⚠️ Auth loading timeout - forcing loading to false');
      setLoading(false);
    }, 1500); // 1.5 second timeout
    
    // Only listen for Supabase auth changes if not in demo mode
    if (!isDemoMode()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          try {
            if (session?.user) {
              const userData = await getCurrentUser();
              setUser(userData);
            } else {
              setUser(null);
            }
          } catch (error) {
            console.error('Error handling auth state change:', error);
            setError(SupabaseErrorHandler.handle(error, 'Auth State Change'));
          } finally {
            setLoading(false);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
        clearTimeout(loadingTimeout);
      };
    }

    return () => clearTimeout(loadingTimeout);
  }, []);

  const initializeAuth = async () => {
    console.log('🚀 Initializing auth...');
    
    // Check for localStorage admin auth from standalone page
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      try {
        const authData = JSON.parse(adminAuth);
        if (authData.email === 'support@homelistingai.com' && authData.role === 'admin') {
          console.log('✅ Found localStorage admin auth');
          setUser({
            id: 'admin-123',
            email: authData.email,
            name: 'Admin User',
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            app_metadata: { role: 'admin' },
            user_metadata: { name: 'Admin User' },
            aud: 'authenticated',
          });
          setLoading(false);
          setError(null);
          return;
        }
      } catch (error) {
        console.error('Error parsing admin auth:', error);
        localStorage.removeItem('adminAuth');
      }
    }
    
    // Immediately set loading to false for demo mode
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: Immediate initialization');
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔌 Checking Supabase connection...');
      // Check if we're connected first
      const isHealthy = await healthMonitor.forceHealthCheck();
      if (!isHealthy) {
        console.warn('Supabase connection unhealthy during auth initialization');
        // Force demo mode if connection fails
        setUser(null);
        setLoading(false);
        return;
      }
      
      console.log('👤 Getting current user...');
      const userData = await getCurrentUser();
      setUser(userData);
      console.log('✅ Auth initialization complete');
    } catch (error) {
      console.error('Error initializing auth:', error);
      setError(SupabaseErrorHandler.handle(error, 'Auth Initialization'));
      // Set user to null on error to prevent infinite loading
      setUser(null);
    } finally {
      setLoading(false);
      console.log('🏁 Auth loading set to false');
    }
  };

  const handleLogin = async (email: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await login({ email, password });
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await logout();
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, name: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await signup({ email, password, name });
      setUser(userData);
      return userData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await resetPassword(email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (newPassword: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await updatePassword(newPassword);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setError(SupabaseErrorHandler.handle(error, 'Refresh User'));
    }
  };

  const forceHealthCheck = async (): Promise<boolean> => {
    const isHealthy = await healthMonitor.forceHealthCheck();
    setConnectionStatus(healthMonitor.getConnectionStatus());
    return isHealthy;
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isLoading: loading, // Alias for loading
    isAuthenticated: !!user,
    error,
    connectionStatus,
    login: handleLogin,
    logout: handleLogout,
    signup: handleSignup,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    clearError,
    isAdmin: isAdmin(user),
    refreshUser,
    forceHealthCheck,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
