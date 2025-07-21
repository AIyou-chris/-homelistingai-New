import { supabase } from '../lib/supabase';
import { Lead } from '../types';
import { scheduleFollowUpSequence } from './followupService';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const leads: Lead[] = [];

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: 'chat' | 'qr_scan' | 'form' | 'manual';
  listing_id?: string;
}

// Send lead notification to agent
const sendLeadNotification = async (leadData: LeadData, listingData?: any) => {
  try {
    // Get agent email from listing
    let agentEmail = 'cdipotter@me.com'; // Default fallback
    
    if (listingData?.agent_id) {
      // Get agent profile to find their email
      const { data: agentProfile } = await supabase
        .from('agent_profiles')
        .select('email')
        .eq('user_id', listingData.agent_id)
        .single();
      
      if (agentProfile?.email) {
        agentEmail = agentProfile.email;
      }
    }

    // Send notification email
    const response = await fetch('https://gezqfksuazkfabhhpaqp.supabase.co/functions/v1/lead-notification', {
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
        listingData
      })
    });

    if (response.ok) {
      console.log('Lead notification sent successfully');
    } else {
      console.error('Failed to send lead notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending lead notification:', error);
    // Don't fail the lead creation if notification fails
  }
};

export const createLead = async (leadData: LeadData): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      message: leadData.message,
      source: leadData.source,
      listing_id: leadData.listing_id,
      status: 'new',
      timestamp: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }

  // Send notification email to agent
  if (leadData.listing_id) {
    // Get listing data for the notification
    const { data: listingData } = await supabase
      .from('listings')
      .select('*')
      .eq('id', leadData.listing_id)
      .single();
    
    await sendLeadNotification(leadData, listingData);
    
    // Schedule follow-up sequence
    if (listingData?.agent_id) {
      const { data: agentData } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', listingData.agent_id)
        .single();
      
      await scheduleFollowUpSequence(data.id, data, listingData, agentData);
    } else {
      await scheduleFollowUpSequence(data.id, data);
    }
  } else {
    await sendLeadNotification(leadData);
    await scheduleFollowUpSequence(data.id, data);
  }

  return data;
};

export const getLeads = async (agentId?: string): Promise<Lead[]> => {
  let query = supabase
    .from('leads')
    .select(`
      *,
      listing:listings(*)
    `)
    .order('timestamp', { ascending: false });

  if (agentId) {
    query = query.eq('listing.agent_id', agentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return data || [];
};

export const updateLeadStatus = async (leadId: string, status: 'new' | 'contacted' | 'qualified' | 'lost'): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', leadId)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }

  return data;
};

export const getLeadById = async (leadId: string): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      listing:listings(*)
    `)
    .eq('id', leadId)
    .single();

  if (error) {
    console.error('Error fetching lead:', error);
    return null;
  }

  return data;
};

// Mock function for demo purposes
export const createMockLead = async (leadData: LeadData): Promise<Lead> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockLead: Lead = {
    id: `lead-${Date.now()}`,
    listing_id: leadData.listing_id || '',
    agent_id: 'mock-agent-id',
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    message: leadData.message,
    source: leadData.source,
    created_at: new Date().toISOString(),
    status: 'new'
  };

  console.log('Mock lead created:', mockLead);
  return mockLead;
};

export const addLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'agent_id'>): Promise<Lead> => {
  console.log("Adding lead with data:", leadData);
  
  const newLead: Lead = {
    id: `${Date.now()}`,
    agent_id: 'mock-agent-id', // This should be determined by the listing
    ...leadData,
    created_at: new Date().toISOString(),
  };

  leads.push(newLead);
  return newLead;
};

export const getLeadsForAgent = async (agentId: string): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      listing:listings(*)
    `)
    .eq('listing.agent_id', agentId);

  if (error) {
    console.error('Error fetching leads for agent:', error);
    throw error;
  }

  return data || [];
}; 