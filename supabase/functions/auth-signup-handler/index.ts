import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, password, name, role } = await req.json()
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the anon key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Sign up the user with the correct options format
    // IMPORTANT: Use the options.data object to include user metadata
    // Set default role to "agent" unless another role is specified
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name: name || '',
          role: role || 'agent', // Default role is "agent"
        }
      }
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // After successful signup, create a profile record
    if (data.user) {
      const { error: profileError } = await supabaseClient
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          first_name: name?.split(' ')[0] || '',
          last_name: name?.split(' ').slice(1).join(' ') || '',
          display_name: name || '',
          role: role || 'agent', // Also store role in user_profiles table
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        // We don't want to fail the signup if profile creation fails
        // But we should log it for debugging
      }
      
      // If the role is "agent", also create an agent_profile
      if ((role || 'agent') === 'agent') {
        const { error: agentProfileError } = await supabaseClient
          .from('agent_profiles')
          .insert({
            user_id: data.user.id,
            first_name: name?.split(' ')[0] || '',
            last_name: name?.split(' ').slice(1).join(' ') || '',
            email: email,
          })
          
        if (agentProfileError) {
          console.error('Error creating agent profile:', agentProfileError)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        user: data.user,
        message: 'Signup successful! Please check your email to confirm your account.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 