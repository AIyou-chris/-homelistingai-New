import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, calendly-webhook-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function verifySignature(req: Request, body: string, signingKey: string | undefined): boolean {
  // Calendly sends X-Calendly-Webhook-Signature header (HMAC SHA256)
  const signature = req.headers.get('Calendly-Webhook-Signature') || req.headers.get('calendly-webhook-signature');
  if (!signature || !signingKey) return false;
  // Deno does not have crypto.createHmac, so use subtle
  const encoder = new TextEncoder();
  const key = encoder.encode(signingKey);
  const data = encoder.encode(body);
  return crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
    .then(cryptoKey => crypto.subtle.verify('HMAC', cryptoKey, hexToBytes(signature), data));
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.startsWith('sha256=')) hex = hex.slice(7);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  const signingKey = Deno.env.get('CALENDLY_WEBHOOK_SIGNING_KEY');
  const body = await req.text();
  const valid = await verifySignature(req, body, signingKey);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: corsHeaders });
  }

  // Log the event (extend to handle events as needed)
  console.log('Calendly webhook event:', body);

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}); 