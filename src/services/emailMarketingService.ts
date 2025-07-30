import { supabase } from '../lib/supabase';
import { 
  sendEmail, 
  sendBulkEmails, 
  verifyEmail,
  processHtmlWithTracking,
  EmailOptions 
} from './mailgunService';

// Types
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  scheduled_at?: string;
  sent_at?: string;
  total_recipients: number;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  source: 'manual' | 'website' | 'qr_scan' | 'chat' | 'import';
  status: 'active' | 'unsubscribed' | 'bounced' | 'spam';
  subscribed_at: string;
  unsubscribed_at?: string;
  last_email_sent?: string;
  total_emails_sent: number;
  total_emails_opened: number;
  total_emails_clicked: number;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  category: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriberSegment {
  id: string;
  name: string;
  description?: string;
  filter_criteria: any;
  subscriber_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSend {
  id: string;
  campaign_id: string;
  subscriber_id: string;
  email: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounced_at?: string;
  bounce_reason?: string;
  unsubscribed_at?: string;
  tracking_id: string;
  created_at: string;
}

export interface EmailClick {
  id: string;
  send_id: string;
  url: string;
  clicked_at: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Campaign Management
export const getCampaigns = async (): Promise<EmailCampaign[]> => {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
};

export const createCampaign = async (
  name: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<EmailCampaign | null> => {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert({
        name,
        subject,
        html_content: htmlContent,
        text_content: textContent,
        status: 'draft'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    return null;
  }
};

export const updateCampaign = async (
  id: string,
  updates: Partial<EmailCampaign>
): Promise<EmailCampaign | null> => {
  try {
    const { data, error } = await supabase
      .from('email_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating campaign:', error);
    return null;
  }
};

export const deleteCampaign = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return false;
  }
};

export const scheduleCampaign = async (
  id: string,
  scheduledAt: string
): Promise<EmailCampaign | null> => {
  return updateCampaign(id, {
    status: 'scheduled',
    scheduled_at: scheduledAt
  });
};

// Subscriber Management
export const getSubscribers = async (): Promise<EmailSubscriber[]> => {
  try {
    const { data, error } = await supabase
      .from('email_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
};

export const createSubscriber = async (
  email: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  company?: string,
  source: 'manual' | 'website' | 'qr_scan' | 'chat' | 'import' = 'manual'
): Promise<EmailSubscriber | null> => {
  try {
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        company,
        source,
        status: 'active'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return null;
  }
};

export const updateSubscriber = async (
  id: string,
  updates: Partial<EmailSubscriber>
): Promise<EmailSubscriber | null> => {
  try {
    const { data, error } = await supabase
      .from('email_subscribers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return null;
  }
};

export const unsubscribeSubscriber = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('email_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
};

export const importSubscribers = async (
  subscribers: Array<{
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    company?: string;
  }>
): Promise<{ success: number; errors: number }> => {
  let success = 0;
  let errors = 0;

  for (const subscriber of subscribers) {
    try {
      const result = await createSubscriber(
        subscriber.email,
        subscriber.first_name,
        subscriber.last_name,
        subscriber.phone,
        subscriber.company,
        'import'
      );
      
      if (result) {
        success++;
      } else {
        errors++;
      }
    } catch (error) {
      errors++;
    }
  }

  return { success, errors };
};

// Template Management
export const getTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

export const createTemplate = async (
  name: string,
  subject: string,
  htmlContent: string,
  textContent?: string,
  category: string = 'general'
): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        name,
        subject,
        html_content: htmlContent,
        text_content: textContent,
        category,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating template:', error);
    return null;
  }
};

// Segment Management
export const getSegments = async (): Promise<SubscriberSegment[]> => {
  try {
    const { data, error } = await supabase
      .from('subscriber_segments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching segments:', error);
    return [];
  }
};

export const createSegment = async (
  name: string,
  description?: string,
  filterCriteria?: any
): Promise<SubscriberSegment | null> => {
  try {
    const { data, error } = await supabase
      .from('subscriber_segments')
      .insert({
        name,
        description,
        filter_criteria: filterCriteria || {}
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating segment:', error);
    return null;
  }
};

// Analytics and Tracking
export const getCampaignStats = async (campaignId: string) => {
  try {
    const { data, error } = await supabase
      .from('email_sends')
      .select(`
        *,
        email_subscribers (
          first_name,
          last_name,
          email
        )
      `)
      .eq('campaign_id', campaignId);
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      sent: data?.filter((s: any) => s.sent_at).length || 0,
      delivered: data?.filter((s: any) => s.delivered_at).length || 0,
      opened: data?.filter((s: any) => s.opened_at).length || 0,
      clicked: data?.filter((s: any) => s.clicked_at).length || 0,
      bounced: data?.filter((s: any) => s.bounced_at).length || 0,
      unsubscribed: data?.filter((s: any) => s.unsubscribed_at).length || 0
    };
    
    return { stats, sends: data || [] };
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    return { stats: {}, sends: [] };
  }
};

export const trackEmailOpen = async (trackingId: string, ipAddress?: string, userAgent?: string) => {
  try {
    const { error } = await supabase
      .from('email_sends')
      .update({
        opened_at: new Date().toISOString()
      })
      .eq('tracking_id', trackingId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error tracking email open:', error);
    return false;
  }
};

export const trackEmailClick = async (
  trackingId: string,
  url: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    // First, get the send record
    const { data: sendData, error: sendError } = await supabase
      .from('email_sends')
      .select('id')
      .eq('tracking_id', trackingId)
      .single();
    
    if (sendError) throw sendError;
    
    // Update the send record
    const { error: updateError } = await supabase
      .from('email_sends')
      .update({
        clicked_at: new Date().toISOString()
      })
      .eq('tracking_id', trackingId);
    
    if (updateError) throw updateError;
    
    // Create click record
    const { error: clickError } = await supabase
      .from('email_clicks')
      .insert({
        send_id: sendData.id,
        url,
        ip_address: ipAddress,
        user_agent: userAgent
      });
    
    if (clickError) throw clickError;
    
    return true;
  } catch (error) {
    console.error('Error tracking email click:', error);
    return false;
  }
};

// Email Sending with Mailgun integration
export const sendCampaign = async (campaignId: string, segmentIds?: string[]) => {
  try {
    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    
    if (campaignError) throw campaignError;
    
    // Get subscribers
    let subscribersQuery = supabase
      .from('email_subscribers')
      .select('*')
      .eq('status', 'active');
    
    if (segmentIds && segmentIds.length > 0) {
      // Filter by segments (simplified - you'd need more complex logic)
      subscribersQuery = subscribersQuery.in('id', segmentIds);
    }
    
    const { data: subscribers, error: subscribersError } = await subscribersQuery;
    
    if (subscribersError) throw subscribersError;
    
    // Update campaign status
    await updateCampaign(campaignId, {
      status: 'sending',
      total_recipients: subscribers?.length || 0
    });
    
    // Create send records and prepare emails
    const sendRecords = subscribers?.map((subscriber: any) => ({
      campaign_id: campaignId,
      subscriber_id: subscriber.id,
      email: subscriber.email,
      tracking_id: `${campaignId}-${subscriber.id}-${Date.now()}`
    })) || [];
    
    if (sendRecords.length > 0) {
      // Insert send records
      const { error: sendsError } = await supabase
        .from('email_sends')
        .insert(sendRecords);
      
      if (sendsError) throw sendsError;
      
      // Prepare emails for sending
      const emails: EmailOptions[] = sendRecords.map((sendRecord: any) => {
        const subscriber = subscribers.find((s: any) => s.id === sendRecord.subscriber_id);
        const processedHtml = processHtmlWithTracking(
          campaign.html_content,
          sendRecord.tracking_id,
          import.meta.env.VITE_APP_DOMAIN || window.location.origin
        );
        
                  return {
            to: subscriber.email,
            from: import.meta.env.VITE_EMAIL_FROM || 'noreply@homelistingai.com',
            subject: campaign.subject,
            html: processedHtml,
            text: campaign.text_content,
            trackingId: sendRecord.tracking_id,
            campaignId: campaignId
          };
      });
      
      // Send emails in bulk
      const sendResult = await sendBulkEmails(emails);
      
      // Update campaign stats
      await updateCampaign(campaignId, {
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_count: sendResult.success,
        opened_count: 0, // Will be updated by tracking
        clicked_count: 0, // Will be updated by tracking
        bounced_count: sendResult.errors
      });
      
      return {
        success: true,
        sentCount: sendResult.success,
        errorCount: sendResult.errors,
        campaign: campaign
      };
    }
    
    return {
      success: true,
      sentCount: 0,
      campaign: campaign
    };
  } catch (error) {
    console.error('Error sending campaign:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Utility functions
export const generateTrackingPixel = (trackingId: string) => {
  return `https://yourdomain.com/track/open/${trackingId}`;
};

export const generateTrackingLink = (originalUrl: string, trackingId: string) => {
  return `https://yourdomain.com/track/click/${trackingId}?url=${encodeURIComponent(originalUrl)}`;
};

export const getSubscriberStats = async () => {
  try {
    const { data, error } = await supabase
      .from('email_subscribers')
      .select('status');
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      active: data?.filter((s: any) => s.status === 'active').length || 0,
      unsubscribed: data?.filter((s: any) => s.status === 'unsubscribed').length || 0,
      bounced: data?.filter((s: any) => s.status === 'bounced').length || 0,
      spam: data?.filter((s: any) => s.status === 'spam').length || 0
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    return {};
  }
}; 