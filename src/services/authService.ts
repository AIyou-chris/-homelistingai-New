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

interface LoginCredentials {
  email: string;
  password?: string;
  provider?: 'google' | 'facebook';
}

interface SignUpCredentials extends LoginCredentials {
  name: string;
}

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (credentials: LoginCredentials): Promise<User> => {
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
  
  return {
    ...data.user,
    name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  if (!user) {
    return null;
  }

  return {
    ...user,
    name: user.user_metadata?.name || user.email!.split('@')[0],
  };
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
    return {
      ...data.user,
      name: data.user.user_metadata?.name || credentials.name,
    };
  }
  
  throw new Error('Signup failed');
};
