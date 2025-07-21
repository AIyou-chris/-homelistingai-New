import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// Email forwarding function for agent emails
// This handles forwarding emails sent to agent@homelistingai.com addresses

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const { 
      to, 
      from, 
      subject, 
      html, 
      text,
      agentEmail 
    } = await req.json()
    
    if (!to || !subject || !agentEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Using Resend for forwarding
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (RESEND_API_KEY) {
      // Create forwarded email with original sender info
      const forwardedSubject = `Fwd: ${subject}`
      const forwardedHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #0ea5e9; margin-bottom: 20px;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              <strong>Forwarded from:</strong> ${from}<br>
              <strong>Original recipient:</strong> ${to}<br>
              <strong>Date:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
            ${html || text}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px;">
              This email was forwarded by HomeListingAI. Reply to respond to the original sender.
            </p>
          </div>
        </div>
      `

      const emailData = {
        from: 'HomeListingAI <onboarding@resend.dev>',
        to: agentEmail,
        subject: forwardedSubject,
        html: forwardedHtml
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
        throw new Error(`Resend forwarding error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      return new Response(JSON.stringify({ 
        message: 'Email forwarded successfully',
        id: result.id 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Fallback - just log the forwarding
    console.log('Email would be forwarded via Resend:', { 
      to: agentEmail, 
      subject, 
      originalFrom: from,
      originalTo: to 
    })
    
    return new Response(JSON.stringify({ message: 'Email forwarding logged (development mode)' }), {
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