import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const { code, redirect_uri, user_id } = await req.json();
    if (!code || !redirect_uri || !user_id) {
      return new Response(JSON.stringify({ error: 'Missing code, redirect_uri, or user_id' }), { status: 400, headers: corsHeaders });
    }

    const clientId = Deno.env.get('CALENDLY_CLIENT_ID');
    const clientSecret = Deno.env.get('CALENDLY_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!clientId || !clientSecret || !supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Missing env vars' }), { status: 500, headers: corsHeaders });
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://auth.calendly.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return new Response(JSON.stringify({ error: tokenData.error || 'Token exchange failed' }), { status: 400, headers: corsHeaders });
    }

    // Store tokens in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { access_token, refresh_token, expires_in } = tokenData;
    const { error: dbError } = await supabase.from('calendly_tokens').upsert({
      user_id,
      access_token,
      refresh_token,
      expires_in,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 