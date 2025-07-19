import { supabase } from '../lib/supabase';

export interface FollowUpSequence {
  id: string;
  lead_id: string;
  sequence_number: number;
  scheduled_date: string;
  sent_date?: string;
  status: 'scheduled' | 'sent' | 'cancelled';
  email_subject?: string;
  email_content?: string;
  created_at: string;
  lead?: any;
  listing?: any;
}

export interface FollowUpConfig {
  sequenceNumber: number;
  delayHours: number;
  subject: string;
  template: string;
}

// Default follow-up sequence configuration
const DEFAULT_FOLLOWUP_SEQUENCE: FollowUpConfig[] = [
  {
    sequenceNumber: 1,
    delayHours: 2, // Send 2 hours after lead creation
    subject: 'Thanks for your interest!',
    template: 'welcome'
  },
  {
    sequenceNumber: 2,
    delayHours: 24, // Send 24 hours after lead creation
    subject: 'More details about the property',
    template: 'details'
  },
  {
    sequenceNumber: 3,
    delayHours: 72, // Send 3 days after lead creation
    subject: 'Don\'t miss out on this opportunity!',
    template: 'urgency'
  }
];

// Schedule follow-up emails for a lead
export const scheduleFollowUpSequence = async (leadId: string, leadData: any, listingData?: any, agentData?: any): Promise<void> => {
  try {
    const now = new Date();
    
    // Schedule each follow-up email
    for (const config of DEFAULT_FOLLOWUP_SEQUENCE) {
      const scheduledDate = new Date(now.getTime() + (config.delayHours * 60 * 60 * 1000));
      
      const { error } = await supabase
        .from('follow_up_sequences')
        .insert([{
          lead_id: leadId,
          sequence_number: config.sequenceNumber,
          scheduled_date: scheduledDate.toISOString(),
          status: 'scheduled',
          email_subject: config.subject,
          email_content: config.template
        }]);

      if (error) {
        console.error(`Error scheduling follow-up sequence ${config.sequenceNumber}:`, error);
      } else {
        console.log(`Scheduled follow-up sequence ${config.sequenceNumber} for lead ${leadId}`);
      }
    }
  } catch (error) {
    console.error('Error scheduling follow-up sequence:', error);
  }
};

// Send a specific follow-up email
export const sendFollowUpEmail = async (leadData: any, agentData: any, listingData: any, sequence: number): Promise<void> => {
  try {
    // Get agent email
    let agentEmail = 'cdipotter@me.com'; // Default fallback
    
    if (agentData?.email) {
      agentEmail = agentData.email;
    }

    // Send follow-up email
    const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/lead-followup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenFma3N1YXprZmFiaGhwYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzU4NzIsImV4cCI6MjA2MTcxMTg3Mn0.DaLGsPHzz42ArvA0v8szH9R-bNkqYPeQkt3BSqCiy5o'
      },
      body: JSON.stringify({
        leadData: {
          ...leadData,
          timestamp: new Date().toISOString()
        },
        agentEmail,
        listingData,
        agentData,
        sequence
      })
    });

    if (response.ok) {
      console.log(`Follow-up email sequence ${sequence} sent successfully`);
      
      // Update the follow-up sequence status
      await supabase
        .from('follow_up_sequences')
        .update({ 
          status: 'sent',
          sent_date: new Date().toISOString()
        })
        .eq('lead_id', leadData.id)
        .eq('sequence_number', sequence);
        
    } else {
      console.error('Failed to send follow-up email:', await response.text());
    }
  } catch (error) {
    console.error('Error sending follow-up email:', error);
  }
};

// Get pending follow-up emails that need to be sent
export const getPendingFollowUps = async (): Promise<FollowUpSequence[]> => {
  const now = new Date();
  
  const { data, error } = await supabase
    .from('follow_up_sequences')
    .select(`
      *,
      lead:leads(*),
      listing:listings(*)
    `)
    .eq('status', 'scheduled')
    .lte('scheduled_date', now.toISOString())
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Error fetching pending follow-ups:', error);
    return [];
  }

  return data || [];
};

// Process all pending follow-up emails
export const processPendingFollowUps = async (): Promise<void> => {
  try {
    const pendingFollowUps = await getPendingFollowUps();
    
    for (const followUp of pendingFollowUps) {
      const leadData = followUp.lead;
      const listingData = followUp.listing;
      
      if (leadData) {
        // Get agent data
        let agentData = null;
        if (listingData?.agent_id) {
          const { data: agentProfile } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('user_id', listingData.agent_id)
            .single();
          
          agentData = agentProfile;
        }
        
        // Send the follow-up email
        await sendFollowUpEmail(leadData, agentData, listingData, followUp.sequence_number);
      }
    }
  } catch (error) {
    console.error('Error processing pending follow-ups:', error);
  }
};

// Cancel follow-up sequence for a lead
export const cancelFollowUpSequence = async (leadId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('follow_up_sequences')
      .update({ status: 'cancelled' })
      .eq('lead_id', leadId)
      .eq('status', 'scheduled');

    if (error) {
      console.error('Error cancelling follow-up sequence:', error);
    } else {
      console.log(`Cancelled follow-up sequence for lead ${leadId}`);
    }
  } catch (error) {
    console.error('Error cancelling follow-up sequence:', error);
  }
};

// Get follow-up statistics for a lead
export const getFollowUpStats = async (leadId: string): Promise<{
  totalScheduled: number;
  totalSent: number;
  totalCancelled: number;
  nextFollowUp?: FollowUpSequence;
}> => {
  try {
    // Validate leadId
    if (!leadId || typeof leadId !== 'string') {
      console.warn('Invalid leadId provided to getFollowUpStats:', leadId);
      return { totalScheduled: 0, totalSent: 0, totalCancelled: 0 };
    }

    const { data, error } = await supabase
      .from('follow_up_sequences')
      .select('*')
      .eq('lead_id', leadId);

    if (error) {
      // Don't log errors for demo leads or invalid IDs
      if (!leadId.includes('-demo')) {
        console.error('Error fetching follow-up stats:', error);
      }
      return { totalScheduled: 0, totalSent: 0, totalCancelled: 0 };
    }

    const sequences = data || [];
    const stats = {
      totalScheduled: sequences.filter(s => s.status === 'scheduled').length,
      totalSent: sequences.filter(s => s.status === 'sent').length,
      totalCancelled: sequences.filter(s => s.status === 'cancelled').length,
      nextFollowUp: sequences.find(s => s.status === 'scheduled')
    };

    return stats;
  } catch (error) {
    // Don't log errors for demo leads
    if (!leadId.includes('-demo')) {
      console.error('Error getting follow-up stats:', error);
    }
    return { totalScheduled: 0, totalSent: 0, totalCancelled: 0 };
  }
}; 