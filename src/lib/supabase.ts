import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables - using mock client')
    // Return a mock client for development
    return {
      from: (table: string) => ({
        select: (columns?: string) => ({
          single: () => Promise.resolve({ data: null, error: null }),
          eq: (column: string, value: any) => ({
            select: (columns?: string) => {
              // Handle agent_id filtering
              if (column === 'agent_id' && (value === 'dev-user-id' || value === '00000000-0000-0000-0000-000000000000')) {
                return Promise.resolve({ 
                  data: [
                    {
                      id: 'mock-listing-1',
                      title: 'Beautiful Mountain View Home',
                      description: 'A stunning property with amazing views',
                      address: '123 Mountain View Dr, Cashmere, WA 98815',
                      price: 750000,
                      property_type: 'Single-Family Home',
                      status: 'active',
                      bedrooms: 4,
                      bathrooms: 3,
                      square_footage: 2200,
                      image_urls: [],
                      created_at: new Date().toISOString(),
                      agent_id: 'dev-user-id'
                    },
                    {
                      id: 'mock-listing-2',
                      title: 'Cozy Downtown Condo',
                      description: 'Perfect for first-time buyers',
                      address: '456 Main St, Cashmere, WA 98815',
                      price: 350000,
                      property_type: 'Condo',
                      status: 'active',
                      bedrooms: 2,
                      bathrooms: 2,
                      square_footage: 1200,
                      image_urls: [],
                      created_at: new Date().toISOString(),
                      agent_id: 'dev-user-id'
                    }
                  ], 
                  error: null 
                });
              }
              return Promise.resolve({ data: [], error: null });
            },
            order: (column: string, options?: any) => {
              // Handle the complete query chain: from().select().eq().order()
              if (column === 'created_at' && options?.ascending === false) {
                return Promise.resolve({ 
                  data: [
                    {
                      id: 'mock-listing-1',
                      title: 'Beautiful Mountain View Home',
                      description: 'A stunning property with amazing views',
                      address: '123 Mountain View Dr, Cashmere, WA 98815',
                      price: 750000,
                      property_type: 'Single-Family Home',
                      status: 'active',
                      bedrooms: 4,
                      bathrooms: 3,
                      square_footage: 2200,
                      image_urls: [],
                      created_at: new Date().toISOString(),
                      agent_id: 'dev-user-id'
                    },
                    {
                      id: 'mock-listing-2',
                      title: 'Cozy Downtown Condo',
                      description: 'Perfect for first-time buyers',
                      address: '456 Main St, Cashmere, WA 98815',
                      price: 350000,
                      property_type: 'Condo',
                      status: 'active',
                      bedrooms: 2,
                      bathrooms: 2,
                      square_footage: 1200,
                      image_urls: [],
                      created_at: new Date().toISOString(),
                      agent_id: 'dev-user-id'
                    }
                  ], 
                  error: null 
                });
              }
              return Promise.resolve({ data: [], error: null });
            }
          }),
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
          order: (column: string, options?: any) => Promise.resolve({ 
            data: [
              {
                id: 'mock-listing-1',
                title: 'Beautiful Mountain View Home',
                description: 'A stunning property with amazing views',
                address: '123 Mountain View Dr, Cashmere, WA 98815',
                price: 750000,
                property_type: 'Single-Family Home',
                status: 'active',
                bedrooms: 4,
                bathrooms: 3,
                square_footage: 2200,
                image_urls: [],
                created_at: new Date().toISOString(),
                agent_id: 'dev-user-id',
                photos: [],
                agent: {
                  id: 'dev-user-id',
                  name: 'Demo Agent',
                  email: 'demo@example.com',
                  phone: '(555) 123-4567',
                  agency: 'Demo Real Estate'
                }
              },
              {
                id: 'mock-listing-2',
                title: 'Cozy Downtown Condo',
                description: 'Perfect for first-time buyers',
                address: '456 Main St, Cashmere, WA 98815',
                price: 350000,
                property_type: 'Condo',
                status: 'active',
                bedrooms: 2,
                bathrooms: 2,
                square_footage: 1200,
                image_urls: [],
                created_at: new Date().toISOString(),
                agent_id: 'dev-user-id',
                photos: [],
                agent: {
                  id: 'dev-user-id',
                  name: 'Demo Agent',
                  email: 'demo@example.com',
                  phone: '(555) 123-4567',
                  agency: 'Demo Real Estate'
                }
              }
            ], 
            error: null 
          })
        }),
        insert: (data: any) => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: {
                id: 'mock-listing-id',
                title: data.title || 'Mock Listing',
                address: data.address || 'Mock Address',
                price: data.price || 500000,
                bedrooms: data.bedrooms || 3,
                bathrooms: data.bathrooms || 2,
                square_footage: data.square_footage || 1500,
                status: 'active',
                created_at: new Date().toISOString(),
                agent_id: data.agent_id || 'dev-user-id'
              }, 
              error: null 
            })
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null })
            })
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
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