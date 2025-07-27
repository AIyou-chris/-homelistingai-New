import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables - using mock client')
    // Return a mock client for development
    return {
      from: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          eq: () => ({
            select: () => Promise.resolve({ data: [], error: null })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: {
                id: 'mock-listing-id',
                title: 'Mock Listing',
                address: 'Mock Address',
                price: 500000,
                bedrooms: 3,
                bathrooms: 2,
                square_feet: 1500,
                status: 'active',
                created_at: new Date().toISOString(),
                agent_id: 'mock-user-id'
              }, 
              error: null 
            })
          })
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null })
            })
          })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null })
        })
      }),
      auth: {
        signInWithPassword: (credentials: any) => Promise.resolve({ 
          data: { 
            user: {
              id: 'dev-user-id',
              email: credentials.email,
              user_metadata: { name: credentials.email.split('@')[0] }
            }
          }, 
          error: null
        }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
        signUp: (credentials: any) => Promise.resolve({ 
          data: { 
            user: {
              id: 'dev-user-id',
              email: credentials.email,
              user_metadata: { name: credentials.user_metadata?.name || credentials.email.split('@')[0] }
            }
          }, 
          error: null
        }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => {
          // Check if we have a stored user (simulate session)
          const storedUser = localStorage.getItem('mock_user');
          if (storedUser) {
            return Promise.resolve({ 
              data: { 
                user: JSON.parse(storedUser)
              }, 
              error: null 
            });
          }
          return Promise.resolve({ 
            data: { 
              user: null
            }, 
            error: null 
          });
        }
      }
    } as any
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient() 