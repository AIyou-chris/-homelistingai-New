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
  provider?: 'google' | 'facebook' | 'linkedin';
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
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
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

export const signInWithProvider = async (provider: 'google' | 'facebook' | 'linkedin'): Promise<void> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  
  if (error) throw new Error(error.message);
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
  console.log('Attempting signup with:', credentials); // Log credentials for debugging
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password!,
    options: {
      data: {
        name: credentials.name,
      }
    }
  });

  if (error) {
    console.error('Supabase signup error:', error); // Log full error for debugging
    throw new Error(error.message);
  }

  if (data.user) {
    // Send welcome email with login link (non-blocking)
    void sendWelcomeEmail(credentials.email, credentials.name);
    return {
      ...data.user,
      name: data.user.user_metadata?.name || credentials.name,
    };
  }
  
  throw new Error('Signup failed');
};

// Send welcome email with login link
const sendWelcomeEmail = async (email: string, name: string) => {
  const loginUrl = `${window.location.origin}/login`;
  
  // Simple email sending - you can replace this with your preferred email service
  const emailData = {
    to: email,
    subject: 'Welcome to HomeListingAI! 🏠',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Welcome to HomeListingAI, ${name}! 🏠</h2>
        <p>Thank you for joining HomeListingAI! You're now ready to create stunning property listings and attract warm leads.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #334155; margin-top: 0;">What's Next?</h3>
          <ul style="color: #475569;">
            <li>Create your first property listing</li>
            <li>Set up your agent profile</li>
            <li>Start attracting qualified leads</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background: linear-gradient(135deg, #0ea5e9, #8b5cf6); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: bold;
                    display: inline-block;">
            Login to Your Dashboard
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          HomeListingAI - Transform Your Real Estate Business
        </p>
      </div>
    `
  };

  // Send email using your preferred method:
  // Option 1: Supabase Edge Function (recommended)
  await fetch('https://gezqfksuazkfabhhpaqp.functions.supabase.co/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
    },
    body: JSON.stringify(emailData)
  });
  
  // Option 2: Direct email service (if you prefer)
  // await sendEmailViaService(emailData);
};
