import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Email sending using Resend
// You'll need to set RESEND_API_KEY in your Supabase secrets

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { to, subject, html, from } = await req.json()
    
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Using Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (RESEND_API_KEY) {
      const emailData = {
        from: from || 'HomeListingAI <onboarding@resend.dev>',
        to: to,
        subject: subject,
        html: html
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Resend error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      return new Response(JSON.stringify({ 
        message: 'Email sent successfully',
        id: result.id 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fallback - just log the email (for development)
    console.log('Email would be sent via Resend:', { to, subject, html })
    
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