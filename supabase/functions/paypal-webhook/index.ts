import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Verify PayPal webhook signature
async function verifyPayPalWebhook(req: Request, body: string): Promise<boolean> {
  const signature = req.headers.get('PAYPAL-TRANSMISSION-SIG');
  const certUrl = req.headers.get('PAYPAL-CERT-URL');
  const transmissionId = req.headers.get('PAYPAL-TRANSMISSION-ID');
  const timestamp = req.headers.get('PAYPAL-TRANSMISSION-TIME');

  if (!signature || !certUrl || !transmissionId || !timestamp) {
    console.error('Missing PayPal webhook headers');
    return false;
  }

  // In production, you should verify the certificate URL is from PayPal
  // and verify the signature. For now, we'll accept the webhook.
  // TODO: Implement proper signature verification
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const isValid = await verifyPayPalWebhook(req, body);
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(body);
    console.log('PayPal webhook event:', event);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different PayPal webhook events
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(supabase, event);
        break;
      
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(supabase, event);
        break;
      
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(supabase, event);
        break;
      
      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(supabase, event);
        break;
      
      case 'PAYMENT.SALE.DENIED':
        await handlePaymentDenied(supabase, event);
        break;
      
      default:
        console.log('Unhandled PayPal event type:', event.event_type);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleSubscriptionActivated(supabase: any, event: any) {
  const subscriptionId = event.resource.id;
  const customId = event.resource.custom_id; // This should contain the user_id
  
  console.log('Subscription activated:', subscriptionId, 'for user:', customId);
  
  // Update user's subscription status
  if (customId) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        subscription_status: 'active',
        subscription_id: subscriptionId,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', customId);
    
    if (error) {
      console.error('Error updating user subscription:', error);
    }
  }
}

async function handleSubscriptionCancelled(supabase: any, event: any) {
  const subscriptionId = event.resource.id;
  
  console.log('Subscription cancelled:', subscriptionId);
  
  // Find user by subscription ID and update status
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      subscription_status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscriptionId);
  
  if (error) {
    console.error('Error updating cancelled subscription:', error);
  }
}

async function handleSubscriptionExpired(supabase: any, event: any) {
  const subscriptionId = event.resource.id;
  
  console.log('Subscription expired:', subscriptionId);
  
  // Find user by subscription ID and update status
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      subscription_status: 'expired',
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscriptionId);
  
  if (error) {
    console.error('Error updating expired subscription:', error);
  }
}

async function handlePaymentCompleted(supabase: any, event: any) {
  const paymentId = event.resource.id;
  const subscriptionId = event.resource.billing_agreement_id;
  const amount = event.resource.amount.total;
  
  console.log('Payment completed:', paymentId, 'for subscription:', subscriptionId, 'amount:', amount);
  
  // Log the payment in a payments table
  const { error } = await supabase
    .from('payments')
    .insert({
      payment_id: paymentId,
      subscription_id: subscriptionId,
      amount: parseFloat(amount),
      status: 'completed',
      created_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('Error logging payment:', error);
  }
}

async function handlePaymentDenied(supabase: any, event: any) {
  const paymentId = event.resource.id;
  const subscriptionId = event.resource.billing_agreement_id;
  
  console.log('Payment denied:', paymentId, 'for subscription:', subscriptionId);
  
  // Update subscription status to past_due
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscriptionId);
  
  if (error) {
    console.error('Error updating denied payment:', error);
  }
} 