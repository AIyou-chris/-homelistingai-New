import { User } from '../types';
import { supabase } from '../lib/supabase';
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

// Admin credentials
const ADMIN_EMAIL = 'support@homelistingai.com';
const ADMIN_PASSWORD = 'Jake@2024';

// Mock admin user
const MOCK_ADMIN_USER: User = {
  id: '00000000-0000-0000-0000-000000000000',
  email: ADMIN_EMAIL,
  name: 'Admin',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: { name: 'Admin' },
  aud: 'authenticated',
};

interface LoginCredentials {
  email: string;
  password?: string;
  provider?: 'google' | 'facebook';
}

interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    // Check for admin login first
    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      console.log('Admin login successful');
      // Store admin credentials for session management
      localStorage.setItem('admin_email', credentials.email);
      localStorage.setItem('admin_password', credentials.password);
      return MOCK_ADMIN_USER;
    }

    if (credentials.provider) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: credentials.provider,
      });
      if (error) throw new Error(error.message);
      // This will redirect, so the promise may not resolve.
      return MOCK_USER; // Placeholder
    }

    const { data, error } = await supabase.auth.signInWithPassword(credentials as any);
    if (error) throw new Error(error.message);
    
    if (!data.user) {
      throw new Error('Login failed - no user data returned');
    }
    
    // Store user in localStorage for mock client
    if (data.user) {
      localStorage.setItem('mock_user', JSON.stringify(data.user));
    }
    
    return {
      ...data.user,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  // Clear admin credentials
  localStorage.removeItem('admin_email');
  localStorage.removeItem('admin_password');
  
  // Clear mock user
  localStorage.removeItem('mock_user');
  
  // Clear all localStorage items that might be causing issues
  localStorage.clear();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log('getCurrentUser called');
    // For demo purposes, check if we have admin credentials in localStorage
    const adminEmail = localStorage.getItem('admin_email');
    const adminPassword = localStorage.getItem('admin_password');
    
    console.log('Admin email from localStorage:', adminEmail);
    console.log('Admin password exists:', !!adminPassword);
    
    if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
      console.log('Returning admin user from localStorage');
      return MOCK_ADMIN_USER;
    }
    
    // Only try Supabase auth if we don't have admin credentials
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting current user:', error);
        return null;
      }

      if (!user) {
        console.log('No user found - returning null');
        return null;
      }

      return {
        ...user,
        name: user.user_metadata?.name || user.email!.split('@')[0],
      };
    } catch (supabaseError) {
      console.error('Supabase auth error:', supabaseError);
      return null;
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

export const signup = async (credentials: SignUpCredentials): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password!,
    options: {
      data: {
        name: credentials.name,
      }
    }
  });

  if (error) throw new Error(error.message);

  if (data.user) {
    // Store user in localStorage for mock client
    localStorage.setItem('mock_user', JSON.stringify(data.user));
    
    return {
      ...data.user,
      name: data.user.user_metadata?.name || credentials.name,
    };
  }
  
  throw new Error('Signup failed');
};

// Admin-specific functions
export const isAdminUser = (user: User | null): boolean => {
  return user?.email === ADMIN_EMAIL || user?.role === 'admin';
};

export const getAdminUser = (): User => {
  return MOCK_ADMIN_USER;
};

// Force clear session - useful for debugging
export const forceClearSession = (): void => {
  localStorage.clear();
  sessionStorage.clear();
  console.log('Session cleared');
};
