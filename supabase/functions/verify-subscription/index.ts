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
    const { user_id, subscription_id } = await req.json();
    
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'user_id is required' }), { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalSecret = Deno.env.get('PAYPAL_SECRET');
    
    if (!supabaseUrl || !supabaseKey || !paypalClientId || !paypalSecret) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get PayPal access token (sandbox)
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user's subscription from database
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_id, subscription_status')
      .eq('user_id', user_id)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: corsHeaders });
    }

    const subscriptionId = subscription_id || userProfile?.subscription_id;
    
    if (!subscriptionId) {
      return new Response(JSON.stringify({ 
        status: 'inactive',
        message: 'No subscription found'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    // Verify subscription with PayPal (sandbox)
    const subscriptionResponse = await fetch(`https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!subscriptionResponse.ok) {
      // Subscription not found or invalid
      await supabase
        .from('user_profiles')
        .update({ 
          subscription_status: 'inactive',
          subscription_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id);

      return new Response(JSON.stringify({ 
        status: 'inactive',
        message: 'Subscription not found'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    const subscriptionData = await subscriptionResponse.json();
    const status = subscriptionData.status;
    
    // Update user profile with current subscription status
    await supabase
      .from('user_profiles')
      .update({ 
        subscription_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id);

    return new Response(JSON.stringify({ 
      status: status,
      subscription: subscriptionData,
      message: `Subscription status: ${status}`
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error('Subscription verification error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 