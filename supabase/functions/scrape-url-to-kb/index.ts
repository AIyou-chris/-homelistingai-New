import { serve } from 'std/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { url, knowledge_base_id, created_by } = await req.json();
    if (!url || !knowledge_base_id || !created_by) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Fetch the page
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch URL' }), { status: 400 });
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract title and main text
    const title = $('title').text() || url;
    let content = '';
    // Try to get main content from <article>, fallback to <body>
    if ($('article').length) {
      content = $('article').text();
    } else {
      content = $('body').text();
    }
    content = content.trim().replace(/\s+/g, ' ').slice(0, 8000); // Limit length

    // Insert into knowledge_base_entries
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/knowledge_base_entries`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        knowledge_base_id,
        entry_type: 'document',
        title,
        content,
        file_url: url,
        created_by,
      }),
    });
    const data = await insertRes.json();
    if (!insertRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to insert KB entry', details: data }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, entry: data[0] }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Unknown error' }), { status: 500 });
  }
}); 