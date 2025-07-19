import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Client confirmation email template
const createClientConfirmationEmail = (appointmentData: any, agentData: any, listingData: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation - HomeListingAI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
        .success-icon { font-size: 48px; margin-bottom: 10px; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .appointment-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .appointment-info { margin-bottom: 15px; }
        .appointment-info strong { color: #374151; }
        .property-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        .agent-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .highlight { background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
        .calendar-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 20px; font-weight: 600; font-size: 14px; margin: 10px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <div class="title">Appointment Confirmed!</div>
            <div class="subtitle">Your property viewing has been scheduled</div>
        </div>
        
        <div class="content">
            <div class="highlight">
                <strong>🎉 Great news!</strong> Your appointment request has been received and confirmed. A real estate agent will contact you shortly to finalize the details.
            </div>
            
            <div class="appointment-card">
                <h3 style="color: #10b981; margin-top: 0;">Appointment Details</h3>
                <div class="appointment-info">
                    <strong>Name:</strong> ${appointmentData.name}<br>
                    <strong>Date:</strong> ${new Date(appointmentData.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                    <strong>Time:</strong> ${appointmentData.preferredTime === 'morning' ? 'Morning (9:00 AM - 12:00 PM)' : appointmentData.preferredTime === 'afternoon' ? 'Afternoon (1:00 PM - 4:00 PM)' : 'Evening (5:00 PM - 8:00 PM)'}<br>
                    <strong>Phone:</strong> <a href="tel:${appointmentData.phone}" style="color: #3b82f6;">${appointmentData.phone}</a><br>
                    <strong>Email:</strong> <a href="mailto:${appointmentData.email}" style="color: #3b82f6;">${appointmentData.email}</a>
                </div>
                ${appointmentData.message ? `<div style="margin-top: 15px;"><strong>Your Message:</strong><br><em>"${appointmentData.message}"</em></div>` : ''}
            </div>
            
            ${listingData ? `
            <div class="property-card">
                <h3 style="color: #3b82f6; margin-top: 0;">Property Details</h3>
                <div class="appointment-info">
                    <strong>Address:</strong> ${listingData.address}, ${listingData.city}, ${listingData.state}<br>
                    <strong>Price:</strong> $${listingData.price?.toLocaleString() || 'Contact for pricing'}<br>
                    <strong>Details:</strong> ${listingData.bedrooms} bed, ${listingData.bathrooms} bath, ${listingData.square_feet?.toLocaleString()} sq ft
                </div>
            </div>
            ` : ''}
            
            ${agentData ? `
            <div class="agent-card">
                <h3 style="color: #f59e0b; margin-top: 0;">Your Agent</h3>
                <div class="appointment-info">
                    <strong>Name:</strong> ${agentData.name || 'Your assigned agent'}<br>
                    <strong>Phone:</strong> <a href="tel:${agentData.phone || ''}" style="color: #3b82f6;">${agentData.phone || 'Will be provided'}</a><br>
                    <strong>Email:</strong> <a href="mailto:${agentData.email || ''}" style="color: #3b82f6;">${agentData.email || 'Will be provided'}</a>
                </div>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://calendar.google.com/event?action=TEMPLATE&text=Property+Viewing&dates=${appointmentData.preferredDate}T${appointmentData.preferredTime === 'morning' ? '09:00' : appointmentData.preferredTime === 'afternoon' ? '14:00' : '17:00'}/PT1H" class="calendar-button">📅 Add to Google Calendar</a>
                <a href="https://outlook.live.com/calendar/0/deeplink/compose?subject=Property+Viewing&startdt=${appointmentData.preferredDate}T${appointmentData.preferredTime === 'morning' ? '09:00' : appointmentData.preferredTime === 'afternoon' ? '14:00' : '17:00'}&enddt=${appointmentData.preferredDate}T${appointmentData.preferredTime === 'morning' ? '10:00' : appointmentData.preferredTime === 'afternoon' ? '15:00' : '18:00'}" class="calendar-button">📅 Add to Outlook</a>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h4 style="color: #0c4a6e; margin-top: 0;">📋 What to Expect</h4>
                <ul style="color: #0369a1; margin: 0; padding-left: 20px;">
                    <li>Your agent will contact you within 24 hours to confirm details</li>
                    <li>Please bring a valid ID for the viewing</li>
                    <li>Feel free to ask questions about the property</li>
                    <li>Let us know if you need to reschedule</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>Need to reschedule? Contact your agent or reply to this email</p>
            <p>© 2024 HomeListingAI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

// Agent notification email template
const createAgentNotificationEmail = (appointmentData: any, agentData: any, listingData: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Appointment Request - HomeListingAI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
        .alert-icon { font-size: 48px; margin-bottom: 10px; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .appointment-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .appointment-info { margin-bottom: 15px; }
        .appointment-info strong { color: #374151; }
        .property-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .action-buttons { text-align: center; margin: 20px 0; }
        .action-button { display: inline-block; padding: 10px 20px; margin: 5px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 14px; }
        .confirm-btn { background: #10b981; color: white; }
        .reschedule-btn { background: #3b82f6; color: white; }
        .cancel-btn { background: #ef4444; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-icon">📅</div>
            <div class="title">New Appointment Request</div>
            <div class="subtitle">A client wants to view your property</div>
        </div>
        
        <div class="content">
            <div class="highlight">
                <strong>⚡ New Request!</strong> A potential buyer has requested a property viewing. Please respond within 24 hours.
            </div>
            
            <div class="appointment-card">
                <h3 style="color: #f59e0b; margin-top: 0;">Client Information</h3>
                <div class="appointment-info">
                    <strong>Name:</strong> ${appointmentData.name}<br>
                    <strong>Email:</strong> <a href="mailto:${appointmentData.email}" style="color: #3b82f6;">${appointmentData.email}</a><br>
                    <strong>Phone:</strong> <a href="tel:${appointmentData.phone}" style="color: #3b82f6;">${appointmentData.phone}</a><br>
                    <strong>Preferred Date:</strong> ${new Date(appointmentData.preferredDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                    <strong>Preferred Time:</strong> ${appointmentData.preferredTime === 'morning' ? 'Morning (9:00 AM - 12:00 PM)' : appointmentData.preferredTime === 'afternoon' ? 'Afternoon (1:00 PM - 4:00 PM)' : 'Evening (5:00 PM - 8:00 PM)'}<br>
                    <strong>Requested:</strong> ${new Date(appointmentData.timestamp).toLocaleString()}
                </div>
                ${appointmentData.message ? `<div style="margin-top: 15px;"><strong>Client Message:</strong><br><em>"${appointmentData.message}"</em></div>` : ''}
            </div>
            
            ${listingData ? `
            <div class="property-card">
                <h3 style="color: #3b82f6; margin-top: 0;">Property Details</h3>
                <div class="appointment-info">
                    <strong>Address:</strong> ${listingData.address}, ${listingData.city}, ${listingData.state}<br>
                    <strong>Price:</strong> $${listingData.price?.toLocaleString() || 'Contact for pricing'}<br>
                    <strong>Details:</strong> ${listingData.bedrooms} bed, ${listingData.bathrooms} bath, ${listingData.square_feet?.toLocaleString()} sq ft
                </div>
            </div>
            ` : ''}
            
            <div class="action-buttons">
                <a href="mailto:${appointmentData.email}?subject=Appointment Confirmation - ${listingData?.title || 'Property Viewing'}&body=Hi ${appointmentData.name},%0D%0A%0D%0AI'm confirming your appointment for ${new Date(appointmentData.preferredDate).toLocaleDateString()} at ${appointmentData.preferredTime === 'morning' ? '9:00 AM' : appointmentData.preferredTime === 'afternoon' ? '2:00 PM' : '5:00 PM'}.%0D%0A%0D%0APlease let me know if you need to reschedule.%0D%0A%0D%0ABest regards,%0D%0A[Your Name]" class="action-button confirm-btn">✅ Confirm Appointment</a>
                <a href="mailto:${appointmentData.email}?subject=Reschedule Request - ${listingData?.title || 'Property Viewing'}&body=Hi ${appointmentData.name},%0D%0A%0D%0AI'd like to discuss rescheduling your appointment. What times work better for you?%0D%0A%0D%0ABest regards,%0D%0A[Your Name]" class="action-button reschedule-btn">🔄 Reschedule</a>
                <a href="mailto:${appointmentData.email}?subject=Appointment Cancellation - ${listingData?.title || 'Property Viewing'}&body=Hi ${appointmentData.name},%0D%0A%0D%0AI'm sorry, but I need to cancel our appointment. I'll be in touch to reschedule.%0D%0A%0D%0ABest regards,%0D%0A[Your Name]" class="action-button cancel-btn">❌ Cancel</a>
            </div>
            
            <div style="text-align: center;">
                <a href="${Deno.env.get('SITE_URL') || 'https://homelistingai.com'}/dashboard/appointments" class="cta-button">📊 View All Appointments</a>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <h4 style="color: #0c4a6e; margin-top: 0;">💡 Quick Tips</h4>
                <ul style="color: #0369a1; margin: 0; padding-left: 20px;">
                    <li>Respond within 24 hours for best client experience</li>
                    <li>Confirm the exact time and meeting location</li>
                    <li>Prepare property details and recent comps</li>
                    <li>Follow up after the viewing with additional information</li>
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
    const { appointmentData, agentEmail, listingData, agentData } = await req.json()
    
    if (!appointmentData || !agentEmail) {
      return new Response(
        JSON.stringify({ error: 'Appointment data and agent email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    try {
      // Send confirmation email to client
      const clientConfirmationHtml = createClientConfirmationEmail(appointmentData, agentData, listingData)
      
      const clientEmailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: appointmentData.email,
          subject: `✅ Appointment Confirmed: ${listingData?.title || 'Property Viewing'} - ${new Date(appointmentData.preferredDate).toLocaleDateString()}`,
          html: clientConfirmationHtml,
          from: 'HomeListingAI <appointments@homelistingai.com>'
        })
      })

      if (!clientEmailResponse.ok) {
        console.error('Failed to send client confirmation:', await clientEmailResponse.text())
      } else {
        console.log('Client confirmation sent successfully to:', appointmentData.email)
      }

      // Send notification email to agent
      const agentNotificationHtml = createAgentNotificationEmail(appointmentData, agentData, listingData)
      
      const agentEmailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: agentEmail,
          subject: `📅 New Appointment Request: ${appointmentData.name} - ${listingData?.title || 'Property Viewing'}`,
          html: agentNotificationHtml,
          from: 'HomeListingAI <appointments@homelistingai.com>'
        })
      })

      if (!agentEmailResponse.ok) {
        console.error('Failed to send agent notification:', await agentEmailResponse.text())
      } else {
        console.log('Agent notification sent successfully to:', agentEmail)
      }

      return new Response(
        JSON.stringify({ 
          message: 'Appointment confirmation emails sent successfully',
          clientEmail: appointmentData.email,
          agentEmail: agentEmail
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (emailError) {
      console.error('Error sending appointment confirmation emails:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send appointment confirmation emails' }),
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