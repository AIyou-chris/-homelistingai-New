import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables - using mock client')
    // Return a mock client for development
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      }),
      auth: {
        signInWithPassword: () => Promise.resolve({ 
          data: { 
            user: {
              id: 'mock-user-id',
              email: 'realtor@example.com',
              user_metadata: { name: 'Demo Realtor' }
            } 
          }, 
          error: null 
        }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ 
          data: { 
            user: {
              id: 'mock-user-id',
              email: 'realtor@example.com',
              user_metadata: { name: 'Demo Realtor' }
            } 
          }, 
          error: null 
        }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ 
          data: { 
            user: {
              id: 'mock-user-id',
              email: 'realtor@example.com',
              user_metadata: { name: 'Demo Realtor' }
            } 
          }, 
          error: null 
        })
      }
    } as any
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient() 