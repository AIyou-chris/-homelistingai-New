import { supabase } from '../lib/supabase';
import { sendEmail } from './mailgunService';

export interface Notification {
  id: string;
  lead_id: string;
  agent_id: string;
  message: string;
  type: 'message' | 'appointment' | 'reminder' | 'system';
  status: 'unread' | 'read' | 'archived';
  created_at: string;
  updated_at: string;
  lead?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateNotificationData {
  lead_id: string;
  message: string;
  type?: 'message' | 'appointment' | 'reminder' | 'system';
}

export const notificationService = {
  // Get all notifications for the current agent
  async getNotifications(): Promise<Notification[]> {
    try {
      // First check if notifications table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('notifications')
        .select('id')
        .limit(1);

      if (tableError) {
        console.log('Notifications table not available, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          lead:leads(name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        // If there's a schema error, try without the join
        if (error.code === 'PGRST200') {
          console.log('🔄 Trying without lead join due to schema issue...');
          const { data: simpleData, error: simpleError } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

          if (simpleError) {
            console.error('Error fetching notifications without join:', simpleError);
            return [];
          }

          return simpleData || [];
        }
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Return empty array for demo users or when notifications table doesn't exist
      return [];
    }
  },

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    try {
      // First check if notifications table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('notifications')
        .select('id')
        .limit(1);

      if (tableError) {
        console.log('Notifications table not available, returning 0');
        return 0;
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error loading unread count:', error);
      // Return 0 for demo users or when notifications table doesn't exist
      return 0;
    }
  },

  // Create a new notification
  async createNotification(notificationData: CreateNotificationData): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return data;
  },

  // Mark notification as read
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('status', 'unread');

    if (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Archive notification
  async archiveNotification(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) {
      console.error('Error archiving notification:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

// Send email notification
export const sendEmailNotification = async (
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await sendEmail({
      to,
      from: 'noreply@homelistingai.com',
      subject,
      html: htmlContent,
      text: textContent
    });

    return { success: result.success, error: result.error };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error: (error as Error).message };
  }
};

// Send lead notification email
export const sendLeadNotification = async (
  leadEmail: string,
  leadName: string,
  agentName: string,
  agentPhone: string
): Promise<{ success: boolean; error?: string }> => {
  const subject = 'New Lead Inquiry - HomeListingAI';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Lead Inquiry</h2>
      <p>Hello ${agentName},</p>
      <p>You have received a new lead inquiry from <strong>${leadName}</strong>.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Lead Details:</h3>
        <p><strong>Name:</strong> ${leadName}</p>
        <p><strong>Email:</strong> ${leadEmail}</p>
        <p><strong>Contact:</strong> ${agentPhone}</p>
      </div>
      <p>Please follow up with this lead as soon as possible.</p>
      <p>Best regards,<br>HomeListingAI Team</p>
    </div>
  `;

  return sendEmailNotification(leadEmail, subject, htmlContent);
};

// Send appointment confirmation email
export const sendAppointmentConfirmation = async (
  clientEmail: string,
  clientName: string,
  appointmentDate: string,
  appointmentTime: string,
  agentName: string,
  agentPhone: string
): Promise<{ success: boolean; error?: string }> => {
  const subject = 'Appointment Confirmation - HomeListingAI';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Appointment Confirmed</h2>
      <p>Hello ${clientName},</p>
      <p>Your appointment with <strong>${agentName}</strong> has been confirmed.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Appointment Details:</h3>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
        <p><strong>Agent:</strong> ${agentName}</p>
        <p><strong>Contact:</strong> ${agentPhone}</p>
      </div>
      <p>We look forward to meeting with you!</p>
      <p>Best regards,<br>HomeListingAI Team</p>
    </div>
  `;

  return sendEmailNotification(clientEmail, subject, htmlContent);
};

// Send listing update notification
export const sendListingUpdate = async (
  clientEmail: string,
  clientName: string,
  listingTitle: string,
  listingUrl: string,
  agentName: string
): Promise<{ success: boolean; error?: string }> => {
  const subject = 'Property Update - HomeListingAI';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Property Update</h2>
      <p>Hello ${clientName},</p>
      <p>There's an update to a property you might be interested in.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Property Details:</h3>
        <p><strong>Property:</strong> ${listingTitle}</p>
        <p><strong>Agent:</strong> ${agentName}</p>
        <a href="${listingUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Property</a>
      </div>
      <p>Best regards,<br>HomeListingAI Team</p>
    </div>
  `;

  return sendEmailNotification(clientEmail, subject, htmlContent);
}; 