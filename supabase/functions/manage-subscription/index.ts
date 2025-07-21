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
    const { user_id, action, subscription_id } = await req.json();
    
    if (!user_id || !action) {
      return new Response(JSON.stringify({ error: 'user_id and action are required' }), { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const paypalSecret = Deno.env.get('PAYPAL_SECRET');
    
    if (!supabaseUrl || !supabaseKey || !paypalClientId || !paypalSecret) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's subscription from database
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_id')
      .eq('user_id', user_id)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: corsHeaders });
    }

    const subId = subscription_id || userProfile?.subscription_id;
    
    if (!subId) {
      return new Response(JSON.stringify({ error: 'No subscription found for user' }), { status: 404, headers: corsHeaders });
    }

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

    let result;
    
    switch (action) {
      case 'cancel':
        result = await cancelSubscription(accessToken, subId, supabase, user_id);
        break;
      
      case 'pause':
        result = await pauseSubscription(accessToken, subId, supabase, user_id);
        break;
      
      case 'reactivate':
        result = await reactivateSubscription(accessToken, subId, supabase, user_id);
        break;
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action. Use: cancel, pause, or reactivate' }), { 
          status: 400, 
          headers: corsHeaders 
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Subscription management error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function cancelSubscription(accessToken: string, subscriptionId: string, supabase: any, userId: string) {
  const response = await fetch(`https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: 'User requested cancellation'
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }

  // Update user profile
  await supabase
    .from('user_profiles')
    .update({ 
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  return { 
    success: true, 
    message: 'Subscription cancelled successfully',
    action: 'cancelled'
  };
}

async function pauseSubscription(accessToken: string, subscriptionId: string, supabase: any, userId: string) {
  const response = await fetch(`https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}/suspend`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reason: 'User requested pause'
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to pause subscription');
  }

  // Update user profile
  await supabase
    .from('user_profiles')
    .update({ 
      subscription_status: 'suspended',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  return { 
    success: true, 
    message: 'Subscription paused successfully',
    action: 'paused'
  };
}

async function reactivateSubscription(accessToken: string, subscriptionId: string, supabase: any, userId: string) {
  const response = await fetch(`https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}/activate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to reactivate subscription');
  }

  // Update user profile
  await supabase
    .from('user_profiles')
    .update({ 
      subscription_status: 'active',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  return { 
    success: true, 
    message: 'Subscription reactivated successfully',
    action: 'reactivated'
  };
} 