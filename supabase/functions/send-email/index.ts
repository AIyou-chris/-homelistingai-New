import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Email sending using Mailgun
// You'll need to set MAILGUN_API_KEY and MAILGUN_DOMAIN in your Supabase secrets

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { to, subject, html } = await req.json()
    
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Using Mailgun
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY')
    const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN')
    
    if (MAILGUN_API_KEY && MAILGUN_DOMAIN) {
      const formData = new FormData()
      formData.append('from', `HomeListingAI <noreply@${MAILGUN_DOMAIN}>`)
      formData.append('to', to)
      formData.append('subject', subject)
      formData.append('html', html)

      const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Mailgun error: ${response.status} - ${errorText}`)
      }

      return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fallback - just log the email (for development)
    console.log('Email would be sent via Mailgun:', { to, subject, html })
    
    return new Response(JSON.stringify({ message: 'Email logged (development mode)' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}) 