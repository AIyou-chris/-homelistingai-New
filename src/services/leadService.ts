import { supabase } from '../lib/supabase';
import { sendLeadNotification } from './notificationService';

export interface Lead {
  id: string;
  listing_id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: 'chat' | 'qr_scan' | 'form' | 'manual';
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadData {
  listing_id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: 'chat' | 'qr_scan' | 'form' | 'manual';
}

export const leadService = {
  // Get all leads for the current agent
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new lead
  async createLead(leadData: CreateLeadData): Promise<Lead> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      // Send email notification to agent
      if (data) {
        try {
          await sendLeadNotification(
            data.email,
            data.name,
            'HomeListingAI Agent', // You can get this from user context
            '+1 (555) 123-4567' // You can get this from user context
          );
          console.log('✅ Lead notification email sent');
        } catch (emailError) {
          console.warn('⚠️ Failed to send lead notification email:', emailError);
          // Don't fail the lead creation if email fails
        }

        // Start advanced follow-up sequence
        try {
          const { advancedFollowupService } = await import('./advancedFollowupService');
          
          // Get default lead capture sequence
          const sequences = await advancedFollowupService.getFollowupSequences();
          const leadSequence = sequences.find(s => s.trigger_type === 'lead_capture' && s.status === 'active');
          
          if (leadSequence) {
            await advancedFollowupService.startFollowupSequence(data.id, leadSequence.id);
            console.log('✅ Advanced follow-up sequence started');
          }
        } catch (followupError) {
          console.warn('⚠️ Failed to start follow-up sequence:', followupError);
          // Don't fail the lead creation if follow-up fails
        }
      }

      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  // Update lead status
  async updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  },

  // Delete a lead
  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }
}; 