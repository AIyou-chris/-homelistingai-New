import { supabase } from '../lib/supabase';
import { Lead } from '../types';

const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const leads: Lead[] = [];

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: 'chat' | 'qr_scan' | 'form' | 'manual';
  listingId?: string;
}

export const createLead = async (leadData: LeadData): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      message: leadData.message,
      source: leadData.source,
      listing_id: leadData.listingId || '',
      status: 'new',
      timestamp: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    throw error;
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
    listing_id: leadData.listingId || '',
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    message: leadData.message,
    source: leadData.source,
    created_at: new Date().toISOString(),
    status: 'new',
    agent_id: ''
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