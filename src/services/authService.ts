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
  console.log('Login attempt with credentials:', { email: credentials.email, provider: credentials.provider });
  
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

  console.log('Attempting password login...');
  const { data, error } = await supabase.auth.signInWithPassword(credentials as any);
  
  if (error) {
    console.error('Supabase login error:', error);
    throw new Error(error.message);
  }
  
  console.log('Login successful, user data:', data.user);
  
  const user: User = {
    ...data.user,
    name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
    role: data.user.user_metadata?.role || 'agent',
  };
  
  console.log('Processed user object:', user);
  return user;
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
  // Clear demo session if exists
  localStorage.removeItem('demo_user');
  localStorage.removeItem('demo_session');
  
  const { error } = await supabase.auth.signOut();
  if (error && !error.message.includes('session_not_found')) {
    throw new Error(error.message);
  }
};

// Demo login function for quick testing
export const demoLogin = async (): Promise<User> => {
  console.log('🎯 Demo login initiated');
  
  // Return a demo user that works with the listings
  const demoUser: User = {
    id: 'demo-user-agent',
    email: 'agent@demo.com',
    name: 'Demo Agent',
    role: 'agent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: { name: 'Demo Agent', role: 'agent' },
    aud: 'authenticated',
  };
  
  // Store in localStorage for persistence
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  localStorage.setItem('demo_session', 'true');
  
  console.log('✅ Demo login successful:', demoUser);
  return demoUser;
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check for demo session first
    const demoSession = localStorage.getItem('demo_session');
    const demoUser = localStorage.getItem('demo_user');
    
    if (demoSession === 'true' && demoUser) {
      console.log('🎯 Demo session detected');
      return JSON.parse(demoUser);
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('Auth session error (this is normal if not logged in):', error.message);
      return null;
    }

    if (!session?.user) {
      return null;
    }

    return {
      ...session.user,
      name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
      role: session.user.user_metadata?.role || 'agent',
    };
  } catch (error) {
    console.log('Auth check error (this is normal if not logged in):', error);
    return null;
  }
};

export const signup = async (credentials: SignUpCredentials): Promise<User> => {
  console.log('Attempting signup with:', credentials); // Log credentials for debugging
  
  try {
    // Call the Edge Function for signup
    const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/auth-signup-handler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
        role: 'agent' // Default role for new signups
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Edge Function signup error:', result);
      throw new Error(result.error || 'Signup failed');
    }

    if (result.user) {
      // Send welcome email with login link (non-blocking)
      // void sendWelcomeEmail(credentials.email, credentials.name);
      return {
        ...result.user,
        name: result.user.user_metadata?.name || credentials.name,
        role: result.user.user_metadata?.role || 'agent',
      };
    }
    
    throw new Error('Signup failed - no user returned');
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
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

export const deleteUserAccount = async (): Promise<void> => {
  try {
    // Ensure user is logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Get the current user's token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    // Send DELETE request to your Edge Function
    const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/secure-user-deletion`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Deletion failed');
    }

    // Handle successful deletion
    console.log('Account successfully deleted');
    
    // Sign out and redirect
    await supabase.auth.signOut();
    window.location.href = '/goodbye'; // Redirect to goodbye page

  } catch (error: any) {
    console.error('Account deletion error:', error);
    throw new Error(`Deletion failed: ${error.message}`);
  }
};
