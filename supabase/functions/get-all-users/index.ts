import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all users from auth.users
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user profiles for additional info
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id, first_name, last_name, display_name, subscription_status')

    // Combine user data with profile data
    const usersWithProfiles = users.users.map(user => {
      const profile = profiles?.find(p => p.user_id === user.id)
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        name: profile?.display_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'N/A',
        subscription_status: profile?.subscription_status || 'inactive',
        profile_exists: !!profile
      }
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        users: usersWithProfiles,
        total: usersWithProfiles.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 