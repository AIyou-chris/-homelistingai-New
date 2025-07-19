import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Follow-up email templates
const createFollowUpEmail = (leadData: any, agentData: any, listingData: any, sequence: number) => {
  const templates = {
    1: {
      subject: `Hi ${leadData.name}, thanks for your interest in ${listingData?.title || 'our property'}!`,
      template: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - HomeListingAI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
        .welcome-icon { font-size: 48px; margin-bottom: 10px; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .property-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
        .agent-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .highlight { background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="welcome-icon">👋</div>
            <div class="title">Thanks for your interest!</div>
            <div class="subtitle">We're excited to help you find your perfect home</div>
        </div>
        
        <div class="content">
            <p>Hi ${leadData.name},</p>
            
            <p>Thank you for reaching out about ${listingData?.title || 'our property'}! I'm ${agentData?.name || 'your real estate agent'} and I'm here to help you every step of the way.</p>
            
            <div class="highlight">
                <strong>🎯 What happens next?</strong><br>
                I'll be in touch within the next few hours to discuss your needs and answer any questions you might have.
            </div>
            
            ${listingData ? `
            <div class="property-card">
                <h3 style="color: #667eea; margin-top: 0;">Property Highlights</h3>
                <p><strong>Address:</strong> ${listingData.address}, ${listingData.city}, ${listingData.state}</p>
                <p><strong>Price:</strong> $${listingData.price?.toLocaleString() || 'Contact for pricing'}</p>
                <p><strong>Features:</strong> ${listingData.bedrooms} bed, ${listingData.bathrooms} bath, ${listingData.square_feet?.toLocaleString()} sq ft</p>
            </div>
            ` : ''}
            
            <div class="agent-card">
                <h3 style="color: #10b981; margin-top: 0;">Your Agent</h3>
                <p><strong>Name:</strong> ${agentData?.name || 'Your assigned agent'}</p>
                <p><strong>Phone:</strong> <a href="tel:${agentData?.phone || ''}" style="color: #3b82f6;">${agentData?.phone || 'Will be provided'}</a></p>
                <p><strong>Email:</strong> <a href="mailto:${agentData?.email || ''}" style="color: #3b82f6;">${agentData?.email || 'Will be provided'}</a></p>
            </div>
            
            <div style="text-align: center;">
                <a href="mailto:${agentData?.email || 'support@homelistingai.com'}?subject=Quick Question about ${listingData?.title || 'Property'}" class="cta-button">💬 Ask a Question</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Looking forward to helping you find your perfect home!</p>
            <p>© 2024 HomeListingAI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `
    },
    2: {
      subject: `${leadData.name}, here's more information about ${listingData?.title || 'the property'} you inquired about`,
      template: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Details - HomeListingAI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
        .info-icon { font-size: 48px; margin-bottom: 10px; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .property-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .feature-list { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .highlight { background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="info-icon">📋</div>
            <div class="title">Property Details</div>
            <div class="subtitle">Everything you need to know about this home</div>
        </div>
        
        <div class="content">
            <p>Hi ${leadData.name},</p>
            
            <p>I wanted to share some additional details about ${listingData?.title || 'the property'} you're interested in. Here's what makes this home special:</p>
            
            ${listingData ? `
            <div class="property-card">
                <h3 style="color: #10b981; margin-top: 0;">Property Overview</h3>
                <p><strong>Address:</strong> ${listingData.address}, ${listingData.city}, ${listingData.state}</p>
                <p><strong>Price:</strong> $${listingData.price?.toLocaleString() || 'Contact for pricing'}</p>
                <p><strong>Size:</strong> ${listingData.bedrooms} bed, ${listingData.bathrooms} bath, ${listingData.square_feet?.toLocaleString()} sq ft</p>
            </div>
            
            <div class="feature-list">
                <h3 style="color: #3b82f6; margin-top: 0;">Key Features</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Modern kitchen with updated appliances</li>
                    <li>Spacious master suite with walk-in closet</li>
                    <li>Beautiful hardwood floors throughout</li>
                    <li>Large backyard perfect for entertaining</li>
                    <li>Excellent school district</li>
                    <li>Convenient location near shopping and dining</li>
                </ul>
            </div>
            ` : ''}
            
            <div class="highlight">
                <strong>💡 Ready to see it in person?</strong><br>
                I'd be happy to schedule a private viewing at your convenience. Just let me know what times work best for you!
            </div>
            
            <div style="text-align: center;">
                <a href="mailto:${agentData?.email || 'support@homelistingai.com'}?subject=Schedule Viewing - ${listingData?.title || 'Property'}" class="cta-button">📅 Schedule a Viewing</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Questions? Just reply to this email or call me anytime!</p>
            <p>© 2024 HomeListingAI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `
    },
    3: {
      subject: `${leadData.name}, don't miss out on ${listingData?.title || 'this amazing property'}!`,
      template: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Don't Miss Out - HomeListingAI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
        .urgency-icon { font-size: 48px; margin-bottom: 10px; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .urgency-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .property-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="urgency-icon">⏰</div>
            <div class="title">Time is of the essence!</div>
            <div class="subtitle">This property is generating a lot of interest</div>
        </div>
        
        <div class="content">
            <p>Hi ${leadData.name},</p>
            
            <p>I wanted to give you a heads up that ${listingData?.title || 'this property'} is receiving multiple inquiries and showings are being scheduled quickly.</p>
            
            <div class="urgency-card">
                <h3 style="color: #f59e0b; margin-top: 0;">Why act now?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Multiple showings scheduled this week</li>
                    <li>Property is priced competitively for the market</li>
                    <li>Similar homes in the area are selling quickly</li>
                    <li>Interest rates are still favorable</li>
                </ul>
            </div>
            
            ${listingData ? `
            <div class="property-card">
                <h3 style="color: #10b981; margin-top: 0;">Property Summary</h3>
                <p><strong>Address:</strong> ${listingData.address}, ${listingData.city}, ${listingData.state}</p>
                <p><strong>Price:</strong> $${listingData.price?.toLocaleString() || 'Contact for pricing'}</p>
                <p><strong>Details:</strong> ${listingData.bedrooms} bed, ${listingData.bathrooms} bath, ${listingData.square_feet?.toLocaleString()} sq ft</p>
            </div>
            ` : ''}
            
            <div class="highlight">
                <strong>🎯 Your next step:</strong><br>
                Schedule a viewing today to ensure you don't miss out on this opportunity. I'm available for showings this week!
            </div>
            
            <div style="text-align: center;">
                <a href="mailto:${agentData?.email || 'support@homelistingai.com'}?subject=Urgent - Schedule Viewing for ${listingData?.title || 'Property'}" class="cta-button">🚀 Schedule Viewing Now</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Don't let this opportunity pass you by!</p>
            <p>© 2024 HomeListingAI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `
    }
  };

  return templates[sequence] || templates[1];
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { leadData, agentEmail, listingData, agentData, sequence = 1 } = await req.json()
    
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

    try {
      // Get email template based on sequence
      const emailTemplate = createFollowUpEmail(leadData, agentData, listingData, sequence)
      
      const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: leadData.email,
          subject: emailTemplate.subject,
          html: emailTemplate.template,
          from: 'HomeListingAI <followup@homelistingai.com>'
        })
      })

      if (!emailResponse.ok) {
        console.error('Failed to send follow-up email:', await emailResponse.text())
        return new Response(
          JSON.stringify({ error: 'Failed to send follow-up email' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`Follow-up email sequence ${sequence} sent successfully to:`, leadData.email)
      
      return new Response(
        JSON.stringify({ 
          message: `Follow-up email sequence ${sequence} sent successfully`,
          leadEmail: leadData.email,
          sequence: sequence
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (emailError) {
      console.error('Error sending follow-up email:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send follow-up email' }),
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