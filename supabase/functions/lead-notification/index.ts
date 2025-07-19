import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Lead notification email template
const createLeadNotificationEmail = (leadData: any, agentData: any, listingData: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Lead Alert - HomeListingAI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
        .alert-icon { font-size: 48px; margin-bottom: 10px; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .lead-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .lead-info { margin-bottom: 15px; }
        .lead-info strong { color: #374151; }
        .property-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .source-badge { display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-icon">🎯</div>
            <div class="title">New Lead Alert!</div>
            <div class="subtitle">Someone is interested in your property</div>
        </div>
        
        <div class="content">
            <div class="highlight">
                <strong>⚡ Hot Lead!</strong> A potential buyer has shown interest in your property and provided their contact information.
            </div>
            
            <div class="lead-card">
                <h3 style="color: #10b981; margin-top: 0;">Lead Information</h3>
                <div class="lead-info">
                    <strong>Name:</strong> ${leadData.name}<br>
                    <strong>Email:</strong> <a href="mailto:${leadData.email}" style="color: #3b82f6;">${leadData.email}</a><br>
                    ${leadData.phone ? `<strong>Phone:</strong> <a href="tel:${leadData.phone}" style="color: #3b82f6;">${leadData.phone}</a><br>` : ''}
                    <strong>Source:</strong> <span class="source-badge">${leadData.source}</span><br>
                    <strong>Time:</strong> ${new Date(leadData.timestamp).toLocaleString()}
                </div>
                ${leadData.message ? `<div style="margin-top: 15px;"><strong>Message:</strong><br><em>"${leadData.message}"</em></div>` : ''}
            </div>
            
            ${listingData ? `
            <div class="property-card">
                <h3 style="color: #3b82f6; margin-top: 0;">Property Details</h3>
                <div class="lead-info">
                    <strong>Address:</strong> ${listingData.address}, ${listingData.city}, ${listingData.state}<br>
                    <strong>Price:</strong> $${listingData.price?.toLocaleString() || 'Contact for pricing'}<br>
                    <strong>Details:</strong> ${listingData.bedrooms} bed, ${listingData.bathrooms} bath, ${listingData.square_feet?.toLocaleString()} sq ft
                </div>
            </div>
            ` : ''}
            
            <div style="text-align: center;">
                <a href="${Deno.env.get('SITE_URL') || 'https://homelistingai.com'}/dashboard/leads" class="cta-button">📊 View All Leads</a>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h4 style="color: #0c4a6e; margin-top: 0;">💡 Quick Actions</h4>
                <ul style="color: #0369a1; margin: 0; padding-left: 20px;">
                    <li>Call the lead within 5 minutes for best response rates</li>
                    <li>Send a personalized follow-up email</li>
                    <li>Schedule a property showing if interested</li>
                    <li>Add notes to your CRM for tracking</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from HomeListingAI</p>
            <p>© 2024 HomeListingAI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { leadData, agentEmail, listingData } = await req.json()
    
    if (!leadData || !agentEmail) {
      return new Response(
        JSON.stringify({ error: 'Lead data and agent email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Send lead notification email
    try {
      const leadNotificationHtml = createLeadNotificationEmail(leadData, null, listingData)
      
      const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: agentEmail,
          subject: `🎯 New Lead Alert: ${leadData.name} - ${listingData?.title || 'Property Inquiry'}`,
          html: leadNotificationHtml,
          from: 'HomeListingAI <leads@homelistingai.com>'
        })
      })

      if (!emailResponse.ok) {
        console.error('Failed to send lead notification:', await emailResponse.text())
        return new Response(
          JSON.stringify({ error: 'Failed to send lead notification email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Lead notification sent successfully to:', agentEmail)
      
      return new Response(
        JSON.stringify({ 
          message: 'Lead notification sent successfully',
          leadId: leadData.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (emailError) {
      console.error('Error sending lead notification:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send lead notification' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 