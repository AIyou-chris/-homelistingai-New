import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
}

// Welcome email template
const createWelcomeEmail = (name: string, dashboardUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HomeListingAI</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin-bottom: 30px; }
        .welcome-text { font-size: 24px; font-weight: 600; margin-bottom: 10px; }
        .subtitle { font-size: 16px; opacity: 0.9; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .feature { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
        .feature h3 { margin: 0 0 10px 0; color: #667eea; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="welcome-text">Welcome to HomeListingAI! 🏠</div>
            <div class="subtitle">Your AI-powered real estate assistant is ready</div>
        </div>
        
        <div class="content">
            <p>Hi ${name || 'there'}!</p>
            
            <p>Welcome to HomeListingAI! You're now part of a community of forward-thinking real estate professionals who are leveraging AI to transform their business.</p>
            
            <div class="highlight">
                <strong>🎉 Your account is ready!</strong> You can start using all our features immediately.
            </div>
            
            <div class="feature">
                <h3>🤖 AI-Powered Listings</h3>
                <p>Create stunning property descriptions in seconds with our advanced AI technology.</p>
            </div>
            
            <div class="feature">
                <h3>📱 Smart Lead Capture</h3>
                <p>Automatically capture and qualify leads through intelligent chat widgets.</p>
            </div>
            
            <div class="feature">
                <h3>📊 Analytics Dashboard</h3>
                <p>Track your performance and optimize your real estate business with detailed insights.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${dashboardUrl}" class="cta-button">🚀 Go to Your Dashboard</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@homelistingai.com">support@homelistingai.com</a></p>
            <p>© 2024 HomeListingAI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    })
  }

  try {
    const { email, password, name, role } = await req.json()
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sign up the user with the correct options format
    // IMPORTANT: Use the options.data object to include user metadata
    // Set default role to "agent" unless another role is specified
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name: name || '',
          role: role || 'agent', // Default role is "agent"
        }
      }
    });

    console.log('Signup result:', { data, error });
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message, details: error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!data.user) {
      return new Response(
        JSON.stringify({ error: 'No user returned from signup', details: data }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // After successful signup, create an agent profile record (optional)
    if (data.user) {
      try {
        const { error: agentProfileError } = await supabaseClient
          .from('agent_profiles')
          .upsert({
            user_id: data.user.id,
            first_name: name?.split(' ')[0] || '',
            last_name: name?.split(' ').slice(1).join(' ') || '',
            email: email,
          }, { onConflict: 'user_id' })
          
        if (agentProfileError) {
          console.error('Error creating agent profile (non-critical):', agentProfileError);
          // Don't fail the signup if agent profile creation fails
        }
      } catch (profileError) {
        console.error('Error creating agent profile (non-critical):', profileError);
        // Don't fail the signup if agent profile creation fails
      }

      // Send welcome email
      try {
        const dashboardUrl = `${Deno.env.get('SITE_URL') || 'http://localhost:3001'}/dashboard`
        const welcomeEmailHtml = createWelcomeEmail(name || 'there', dashboardUrl)
        
        const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: 'Welcome to HomeListingAI! 🏠 Your Dashboard is Ready',
            html: welcomeEmailHtml,
            from: 'HomeListingAI <support@homelistingai.com>'
          })
        })

        if (!emailResponse.ok) {
          console.error('Failed to send welcome email:', await emailResponse.text())
        } else {
          console.log('Welcome email sent successfully to:', email)
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
        // Don't fail the signup if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        user: data.user,
        message: 'Signup successful! Please check your email to confirm your account and access your dashboard.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 