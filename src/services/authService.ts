import { User } from '../types';
import { supabase } from '../lib/supabase';

// Mock user data
const MOCK_USER: User = {
  id: 'user-123',
  email: 'realtor@example.com',
  name: 'Demo Realtor',
  role: 'agent',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
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
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || user.email!.split('@')[0],
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Mock function for signup if needed later
export const signup = async (name: string, email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
