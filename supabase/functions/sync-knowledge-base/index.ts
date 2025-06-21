// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { entryId } = await req.json();
  // Fetch the latest entry content from Supabase
  // (In real use, you would use Supabase client or REST API here)
  // For demo, just echo the entryId

  // Send to your AI vector store/context API
  const aiApiUrl = Deno.env.get('AI_KB_SYNC_ENDPOINT');
  if (!aiApiUrl) {
    return new Response('AI_KB_SYNC_ENDPOINT not set', { status: 500 });
  }

  // Example: POST to AI API
  const aiRes = await fetch(aiApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId }),
  });

  if (!aiRes.ok) {
    return new Response('Failed to sync with AI', { status: 500 });
  }

  return new Response('Synced', { status: 200 });
}); 