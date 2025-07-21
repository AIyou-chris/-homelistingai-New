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
    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Missing env vars' }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: tokenRow, error: tokenError } = await supabase
      .from('calendly_tokens')
      .select('access_token')
      .eq('user_id', user_id)
      .single();
    if (tokenError || !tokenRow) {
      return new Response(JSON.stringify({ error: 'No Calendly token found for user' }), { status: 404, headers: corsHeaders });
    }

    const accessToken = tokenRow.access_token;
    // Fetch events from Calendly API
    const eventsRes = await fetch('https://api.calendly.com/scheduled_events', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const eventsData = await eventsRes.json();
    if (!eventsRes.ok) {
      return new Response(JSON.stringify({ error: eventsData.message || 'Failed to fetch events' }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true, events: eventsData.collection }), {
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