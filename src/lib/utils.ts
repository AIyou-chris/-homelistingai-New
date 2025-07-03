import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Environment validation utilities
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => 
    !import.meta.env[varName] || import.meta.env[varName] === ''
  );

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.error(errorMessage);
    return { isValid: false, missingVars, errorMessage };
  }

  return { isValid: true, missingVars: [], errorMessage: null };
};

// Debug helper for development
export const debugLog = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`🔍 [DEBUG] ${message}`, data || '');
  }
};

// Connection status checker
export const checkNetworkConnection = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.onLine) {
      resolve(false);
      return;
    }

    // Try to fetch a lightweight resource to test actual connectivity
    fetch('/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-cache',
      mode: 'no-cors'
    })
    .then(() => resolve(true))
    .catch(() => resolve(false));
  });
};

// Retry utility for failed operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      debugLog(`Operation failed (attempt ${attempt}/${maxRetries})`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError!;
};

// Format error messages for user display
export const formatErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    // Handle Supabase error objects
    if ('message' in error) {
      return String(error.message);
    }
    
    // Handle generic error objects
    return JSON.stringify(error);
  }
  
  return 'An unexpected error occurred';
};

// Development environment checker
export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;

// Local storage helpers with error handling
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      debugLog(`Failed to get localStorage item: ${key}`, error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      debugLog(`Failed to set localStorage item: ${key}`, error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      debugLog(`Failed to remove localStorage item: ${key}`, error);
      return false;
    }
  }
}; 