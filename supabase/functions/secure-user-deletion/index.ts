import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401, headers: corsHeaders });
    }
    const jwt = authHeader.replace('Bearer ', '');

    // Supabase client as service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Missing environment variables' }), { status: 500, headers: corsHeaders });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401, headers: corsHeaders });
    }
    const userId = user.id;

    // Delete user-related data (add more tables as needed)
    await supabase.from('payments').delete().eq('user_id', userId);
    await supabase.from('appointments').delete().eq('user_id', userId);
    await supabase.from('leads').delete().eq('agent_id', userId);
    await supabase.from('listings').delete().eq('agent_id', userId);
    await supabase.from('user_profiles').delete().eq('user_id', userId);

    // Delete user from auth.users
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      return new Response(JSON.stringify({ error: 'Failed to delete user from auth.users' }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), { status: 500, headers: corsHeaders });
  }
}); 