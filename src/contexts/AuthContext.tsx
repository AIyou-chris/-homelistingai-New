import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, SubscriptionStatus } from '../types';
import * as authService from '../services/authService';
import * as paymentService from '../services/paymentService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  subscriptionStatus: SubscriptionStatus | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  checkSubscription: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Checking auth status...');
      const currentUser = await authService.getCurrentUser();
      console.log('Current user result:', currentUser);
      
      if (currentUser) {
        setUser(currentUser);
        // Skip subscription check for admin users
        if (authService.isAdminUser(currentUser)) {
          console.log('Admin user detected, skipping subscription check');
        } else {
          await checkSubscriptionStatus(currentUser.id);
        }
      } else {
        console.log('No current user found');
        setUser(null);
        setSubscriptionStatus(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Don't throw error, just set user to null
      setUser(null);
      setSubscriptionStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkSubscriptionStatus = useCallback(async (userId: string) => {
    try {
      const status = await paymentService.checkSubscription(userId);
      setSubscriptionStatus(status);
      if (status !== SubscriptionStatus.ACTIVE) {
        // Handle inactive subscription, e.g., redirect or show warning
        console.warn("User subscription is not active:", status);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setSubscriptionStatus(SubscriptionStatus.INACTIVE); // Default to inactive on error
    }
  }, []);
  
  useEffect(() => {
    checkAuthStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login({ email, password: pass });
      setUser(loggedInUser);
      
      // Check if user is admin and redirect accordingly
      if (authService.isAdminUser(loggedInUser)) {
        // Admin users don't need subscription check
        console.log('Admin user logged in');
      } else {
        await checkSubscriptionStatus(loggedInUser.id);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setUser(null);
      setSubscriptionStatus(null);
      throw err; // Re-throw to be caught by UI
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setSubscriptionStatus(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async () => {
    if (user) {
      setIsLoading(true);
      await checkSubscriptionStatus(user.id);
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signup({ name, email, password });
      // After signup, you might want to automatically log in the user
      // or ask them to check their email for verification.
      // For this example, let's just log them in.
      const loggedInUser = await authService.login({ email, password });
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setUser(null);
      setSubscriptionStatus(null);
      throw err; // Re-throw to be caught by the component
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if user is in demo mode (no active subscription or not authenticated)
  const isDemoMode = !user || !subscriptionStatus || subscriptionStatus !== SubscriptionStatus.ACTIVE;

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, subscriptionStatus, isLoading, isDemoMode, login, logout, checkSubscription, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
