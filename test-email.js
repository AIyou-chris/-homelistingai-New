// Test script to add subscriber and send test email
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase
const supabase = createClient(
  'https://your-project.supabase.co', // Replace with your actual Supabase URL
  'your-anon-key' // Replace with your actual anon key
);

// Initialize Resend
const resend = new Resend('re_ieWJUiJr_D1zPPpFo27L7ybB3puaYdzMs');

async function testEmail() {
  try {
    console.log('🚀 Testing email system...');
    
    // 1. Add subscriber
    console.log('📧 Adding subscriber...');
    const { data: subscriber, error: subscriberError } = await supabase
      .from('email_subscribers')
      .insert({
        email: 'homelistingai@gmail.com',
        first_name: 'HomeListing',
        last_name: 'AI',
        source: 'manual',
        status: 'active'
      })
      .select()
      .single();
    
    if (subscriberError) {
      console.error('❌ Error adding subscriber:', subscriberError);
      return;
    }
    
    console.log('✅ Subscriber added:', subscriber.email);
    
    // 2. Create test campaign
    console.log('📝 Creating test campaign...');
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        name: 'Welcome Test Email',
        subject: 'Welcome to HomeListingAI! 🏠',
        html_content: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Welcome to HomeListingAI</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🏠 Welcome to HomeListingAI!</h1>
              <p style="font-size: 18px; margin: 20px 0;">Your AI-powered real estate platform</p>
            </div>
            
            <div style="padding: 30px; background: white; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333;">🎉 Thank you for joining us!</h2>
              <p style="color: #666; line-height: 1.6;">
                We're excited to have you on board! HomeListingAI is your complete solution for:
              </p>
              
              <ul style="color: #666; line-height: 1.6;">
                <li>🤖 AI-powered listing descriptions</li>
                <li>📊 Advanced analytics and insights</li>
                <li>📧 Email marketing automation</li>
                <li>🎯 Lead management and tracking</li>
              </ul>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="https://homelistingai.com" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Our Platform</a>
              </div>
              
              <p style="color: #999; font-size: 14px; text-align: center;">
                This email was sent from your HomeListingAI email marketing system.
              </p>
            </div>
          </body>
          </html>
        `,
        text_content: `
Welcome to HomeListingAI! 🏠

Your AI-powered real estate platform

🎉 Thank you for joining us!

We're excited to have you on board! HomeListingAI is your complete solution for:

🤖 AI-powered listing descriptions
📊 Advanced analytics and insights  
📧 Email marketing automation
🎯 Lead management and tracking

Visit our platform: https://homelistingai.com

This email was sent from your HomeListingAI email marketing system.
        `,
        status: 'draft'
      })
      .select()
      .single();
    
    if (campaignError) {
      console.error('❌ Error creating campaign:', campaignError);
      return;
    }
    
    console.log('✅ Campaign created:', campaign.name);
    
    // 3. Send test email
    console.log('📤 Sending test email...');
    const { data, error } = await resend.emails.send({
      from: 'noreply@homelistingai.com',
      to: 'homelistingai@gmail.com',
      subject: 'Welcome to HomeListingAI! 🏠',
      html: campaign.html_content,
      text: campaign.text_content
    });
    
    if (error) {
      console.error('❌ Error sending email:', error);
      return;
    }
    
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', data.id);
    console.log('📬 Check your inbox: homelistingai@gmail.com');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmail(); 