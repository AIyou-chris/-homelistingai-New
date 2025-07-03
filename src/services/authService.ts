import { User } from '../types';
import { supabase, SupabaseErrorHandler } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Mock user data
const MOCK_USER: User = {
  id: 'user-123',
  email: 'realtor@example.com',
  name: 'Demo Realtor',
  role: 'agent',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { name: 'Demo Realtor' },
  aud: 'authenticated',
};

const MOCK_ADMIN_USER: User = {
  id: 'admin-123',
  email: 'support@homelistingai.com',
  name: 'Admin User',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: { role: 'admin' },
  user_metadata: { name: 'Admin User' },
  aud: 'authenticated',
};

interface LoginCredentials {
  email: string;
  password?: string;
  provider?: 'google' | 'facebook';
}

interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

// Check if we're in demo mode (no Supabase env vars)
const isDemoMode = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return !supabaseUrl || !supabaseKey || supabaseUrl.includes('demo');
};

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    // Demo mode authentication
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: Using mock authentication');
      await apiDelay(1000); // Simulate network delay
      
      // Check demo admin credentials
      if (credentials.email === 'support@homelistingai.com' && 
          credentials.password === 'Jake@2024') {
        return MOCK_ADMIN_USER;
      }
      
      // Check demo user credentials
      if (credentials.email === 'realtor@example.com' && 
          credentials.password === 'demo123') {
        return MOCK_USER;
      }
      
      throw new Error('Invalid email or password. Please check your credentials and try again.');
    }

    // Real Supabase authentication
    if (credentials.provider) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: credentials.provider,
      });
      if (error) throw error;
      return MOCK_USER; // Placeholder
    }

    const { data, error } = await supabase.auth.signInWithPassword(credentials as any);
    if (error) throw error;
    
    return {
      ...data.user,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
    };
  } catch (error) {
    throw new Error(SupabaseErrorHandler.handle(error, 'Login'));
  }
};

export const logout = async () => {
  try {
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: Mock logout');
      await apiDelay(500);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    throw new Error(SupabaseErrorHandler.handle(error, 'Logout'));
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: No persistent session');
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', SupabaseErrorHandler.handle(error, 'Get User'));
      return null;
    }

    if (!user) {
      return null;
    }

    return {
      ...user,
      name: user.user_metadata?.name || user.email!.split('@')[0],
    };
  } catch (error) {
    console.error('Unexpected error getting current user:', error);
    return null;
  }
};

export const signup = async (credentials: SignUpCredentials): Promise<User> => {
  try {
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: Mock signup');
      await apiDelay(1000);
      return {
        ...MOCK_USER,
        email: credentials.email,
        name: credentials.name,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password!,
      options: {
        data: {
          name: credentials.name,
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      return {
        ...data.user,
        name: data.user.user_metadata?.name || credentials.name,
      };
    }
    
    throw new Error('Signup failed - no user returned');
  } catch (error) {
    throw new Error(SupabaseErrorHandler.handle(error, 'Signup'));
  }
};

// Enhanced password reset with better error handling
export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: Mock password reset');
      await apiDelay(1000);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  } catch (error) {
    throw new Error(SupabaseErrorHandler.handle(error, 'Password Reset'));
  }
};

// Update password
export const updatePassword = async (newPassword: string): Promise<void> => {
  try {
    if (isDemoMode()) {
      console.log('🎭 Demo Mode: Mock password update');
      await apiDelay(1000);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  } catch (error) {
    throw new Error(SupabaseErrorHandler.handle(error, 'Update Password'));
  }
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return user.email === 'support@homelistingai.com' || 
         user.app_metadata?.role === 'admin' ||
         user.user_metadata?.role === 'admin';
};
