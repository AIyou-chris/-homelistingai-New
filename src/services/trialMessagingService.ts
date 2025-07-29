import { supabase } from '../lib/supabase';

export interface TrialMessage {
  id: string;
  listing_id: string;
  type: 'welcome' | 'engagement' | 'social_proof' | 'urgency' | 'final';
  title: string;
  message: string;
  cta_text: string;
  cta_link: string;
  show_at_hour: number;
  is_read: boolean;
  sent_at?: Date;
  email_sent?: boolean;
  sms_sent?: boolean;
  push_sent?: boolean;
}

export interface TrialListing {
  id: string;
  created_at: Date;
  expires_at: Date;
  is_trial: boolean;
  user_id?: string;
  payment_status: 'trial' | 'paid' | 'expired';
  agent_id: string;
  title: string;
  price: string;
  address: string;
  status: string;
}

// Message templates for different trial stages
const MESSAGE_TEMPLATES = {
  welcome: {
    title: '🚀 Your AI App is Live!',
    message: 'Your AI assistant is now helping potential buyers. Check your dashboard to see real-time activity!',
    cta_text: 'View Dashboard',
    cta_link: '/dashboard',
    show_at_hour: 0
  },
  engagement: {
    title: '💬 Your AI is Working!',
    message: 'Your AI assistant has already helped 3 potential buyers today. Keep the momentum going!',
    cta_text: 'See Activity',
    cta_link: '/dashboard/ai',
    show_at_hour: 4
  },
  social_proof: {
    title: '📊 Great Performance!',
    message: 'Your listing has been viewed 15 times and generated 2 qualified leads. You\'re in the top 10%!',
    cta_text: 'View Analytics',
    cta_link: '/dashboard/analytics',
    show_at_hour: 12
  },
  urgency: {
    title: '⏰ 24 Hours Left!',
    message: 'Your trial expires in 24 hours. Don\'t lose your leads and momentum - upgrade now!',
    cta_text: 'Upgrade Now',
    cta_link: '/upgrade',
    show_at_hour: 144 // 6 days
  },
  final: {
    title: '🔥 LAST DAY!',
    message: 'Your trial expires in 24 hours. All your leads and AI assistant will be deleted. Upgrade now!',
    cta_text: 'Save My App',
    cta_link: '/upgrade',
    show_at_hour: 156 // 6.5 days
  }
};

// Initialize trial messaging for a new listing
export const initializeTrialMessaging = async (listingId: string): Promise<void> => {
  console.log('📧 Initializing trial messaging for listing:', listingId);
  
  try {
    // Create message records for the trial
    const messages = Object.entries(MESSAGE_TEMPLATES).map(([type, template], index) => ({
      id: `${listingId}-${type}-${index}`,
      listing_id: listingId,
      type: type as keyof typeof MESSAGE_TEMPLATES,
      title: template.title,
      message: template.message,
      cta_text: template.cta_text,
      cta_link: template.cta_link,
      show_at_hour: template.show_at_hour,
      is_read: false
    }));

    // Store messages in database (or local storage for demo)
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem(`trial_messages_${listingId}`, JSON.stringify(messages));
    } else {
      // TODO: Store in Supabase when ready
      console.log('📧 Messages would be stored in database:', messages);
    }

    // Schedule message delivery
    scheduleTrialMessages(listingId, messages);
    
    console.log('✅ Trial messaging initialized');
  } catch (error) {
    console.error('❌ Failed to initialize trial messaging:', error);
  }
};

// Schedule messages to be sent at specific times
const scheduleTrialMessages = (listingId: string, messages: TrialMessage[]): void => {
  messages.forEach(message => {
    const delayMs = message.show_at_hour * 60 * 60 * 1000; // Convert hours to milliseconds
    
    setTimeout(() => {
      sendTrialMessage(listingId, message.type);
    }, delayMs);
  });
};

// Send a specific trial message
export const sendTrialMessage = async (listingId: string, type: keyof typeof MESSAGE_TEMPLATES): Promise<void> => {
  console.log(`📧 Sending ${type} message for listing:`, listingId);
  
  try {
    const template = MESSAGE_TEMPLATES[type];
    
    // Send email
    await sendTrialEmail(listingId, template);
    
    // Send SMS (if phone number available)
    await sendTrialSMS(listingId, template);
    
    // Send push notification
    await sendTrialPush(listingId, template);
    
    // Update message status
    await updateMessageStatus(listingId, type);
    
    console.log(`✅ ${type} message sent successfully`);
  } catch (error) {
    console.error(`❌ Failed to send ${type} message:`, error);
  }
};

// Send trial email
const sendTrialEmail = async (listingId: string, template: any): Promise<void> => {
  try {
    // Get listing and user info
    const listing = await getTrialListing(listingId);
    if (!listing) return;

    const emailData = {
      to: listing.user_id ? `${listing.user_id}@example.com` : 'trial@homelistingai.com',
      subject: template.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">HomeListingAI</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">${template.title}</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">${template.message}</p>
            
            <div style="text-align: center;">
              <a href="${template.cta_link}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                ${template.cta_text}
              </a>
            </div>
            
                         <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
               <p>Your trial expires in 7 days.</p>
               <p>Upgrade now to keep your AI assistant and all your leads!</p>
             </div>
          </div>
        </div>
      `
    };

    console.log('📧 Would send email:', emailData);
    // TODO: Integrate with actual email service
  } catch (error) {
    console.error('❌ Failed to send trial email:', error);
  }
};

// Send trial SMS
const sendTrialSMS = async (listingId: string, template: any): Promise<void> => {
  try {
    const listing = await getTrialListing(listingId);
    if (!listing) return;

    const smsData = {
      to: '+15551234567', // Would get from user profile
      message: `${template.title}\n\n${template.message}\n\n${template.cta_text}: ${template.cta_link}`
    };

    console.log('📱 Would send SMS:', smsData);
    // TODO: Integrate with actual SMS service
  } catch (error) {
    console.error('❌ Failed to send trial SMS:', error);
  }
};

// Send trial push notification
const sendTrialPush = async (listingId: string, template: any): Promise<void> => {
  try {
    const pushData = {
      title: template.title,
      body: template.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: template.cta_link,
        listingId: listingId
      }
    };

    console.log('🔔 Would send push notification:', pushData);
    // TODO: Integrate with actual push notification service
  } catch (error) {
    console.error('❌ Failed to send trial push:', error);
  }
};

// Update message status
const updateMessageStatus = async (listingId: string, type: string): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const messages = JSON.parse(localStorage.getItem(`trial_messages_${listingId}`) || '[]');
      const updatedMessages = messages.map((msg: TrialMessage) => 
        msg.type === type ? { ...msg, sent_at: new Date(), is_read: true } : msg
      );
      localStorage.setItem(`trial_messages_${listingId}`, JSON.stringify(updatedMessages));
    } else {
      // TODO: Update in Supabase
      console.log('📧 Would update message status in database');
    }
  } catch (error) {
    console.error('❌ Failed to update message status:', error);
  }
};

// Get trial listing info
const getTrialListing = async (listingId: string): Promise<TrialListing | null> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      // Mock data for development
      return {
        id: listingId,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        is_trial: true,
        user_id: 'trial-user',
        payment_status: 'trial',
        agent_id: 'trial-agent',
        title: 'Beautiful Property',
        price: '$450,000',
        address: '123 Main St',
        status: 'active'
      };
    } else {
      // TODO: Get from Supabase
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to get trial listing:', error);
    return null;
  }
};

// Get remaining trial time
const getTrialTimeRemaining = async (listingId: string): Promise<number> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const listing = await getTrialListing(listingId);
      if (listing) {
        const now = new Date();
        const expires = new Date(listing.expires_at);
        const remainingMs = expires.getTime() - now.getTime();
        return Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));
      }
    }
    return 168; // 7 days default fallback
  } catch (error) {
    console.error('❌ Failed to get trial time remaining:', error);
    return 48;
  }
};

// Get trial messages for a listing
export const getTrialMessages = async (listingId: string): Promise<TrialMessage[]> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const messages = localStorage.getItem(`trial_messages_${listingId}`);
      return messages ? JSON.parse(messages) : [];
    } else {
      // TODO: Get from Supabase
      return [];
    }
  } catch (error) {
    console.error('❌ Failed to get trial messages:', error);
    return [];
  }
};

// Mark message as read
export const markMessageAsRead = async (listingId: string, messageType: string): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const messages = JSON.parse(localStorage.getItem(`trial_messages_${listingId}`) || '[]');
      const updatedMessages = messages.map((msg: TrialMessage) => 
        msg.type === messageType ? { ...msg, is_read: true } : msg
      );
      localStorage.setItem(`trial_messages_${listingId}`, JSON.stringify(updatedMessages));
    } else {
      // TODO: Update in Supabase
      console.log('📧 Would mark message as read in database');
    }
  } catch (error) {
    console.error('❌ Failed to mark message as read:', error);
  }
};

// Cleanup expired trials
export const cleanupExpiredTrials = async (): Promise<void> => {
  try {
    console.log('🧹 Cleaning up expired trials...');
    
    // TODO: Implement actual cleanup logic
    // 1. Find expired trials
    // 2. Send final warning emails
    // 3. Delete trial data after grace period
    // 4. Offer payment options
    
    console.log('✅ Trial cleanup completed');
  } catch (error) {
    console.error('❌ Failed to cleanup expired trials:', error);
  }
};

// Schedule daily cleanup
setInterval(cleanupExpiredTrials, 24 * 60 * 60 * 1000); // Run daily 