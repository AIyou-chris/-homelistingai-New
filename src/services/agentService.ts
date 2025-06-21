import { supabase } from '../lib/supabase';
import { AgentProfile } from '../types';

export interface AgentEmailConfig {
  type: 'user_provided' | 'auto_generated' | 'custom_domain';
  email: string;
  domain?: string;
  isVerified: boolean;
}

export interface CreateAgentProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  bio?: string;
  emailConfig?: AgentEmailConfig;
}

export const generateAgentEmail = (
  firstName: string,
  lastName: string,
  company?: string,
  customDomain?: string
): AgentEmailConfig => {
  const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '');
  
  // Option 1: Use company domain if available
  if (company && customDomain) {
    return {
      type: 'custom_domain',
      email: `${cleanFirstName}.${cleanLastName}@${customDomain}`,
      domain: customDomain,
      isVerified: false
    };
  }
  
  // Option 2: Extract domain from company website
  if (company) {
    // Simple domain extraction (you might want more sophisticated logic)
    const domainMatch = company.match(/@([^.\s]+\.\w+)/);
    if (domainMatch) {
      return {
        type: 'custom_domain',
        email: `${cleanFirstName}.${cleanLastName}@${domainMatch[1]}`,
        domain: domainMatch[1],
        isVerified: false
      };
    }
  }
  
  // Option 3: System-generated email
  return {
    type: 'auto_generated',
    email: `${cleanFirstName}.${cleanLastName}@homelistingai.com`,
    domain: 'homelistingai.com',
    isVerified: false
  };
};

export const createAgentProfile = async (data: CreateAgentProfileData): Promise<AgentProfile> => {
  // Generate email if not provided
  const emailConfig = data.emailConfig || generateAgentEmail(
    data.firstName,
    data.lastName,
    data.company
  );

  const { data: profile, error } = await supabase
    .from('agent_profiles')
    .insert({
      user_id: data.userId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: emailConfig.email,
      phone: data.phone,
      company_name: data.company,
      website: data.website,
      bio: data.bio,
      email_config: emailConfig
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create agent profile: ${error.message}`);
  }

  return profile;
};

export const getAgentProfile = async (userId: string): Promise<AgentProfile | null> => {
  const { data, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No profile found
    }
    throw new Error(`Failed to get agent profile: ${error.message}`);
  }

  return data;
};

export const updateAgentProfile = async (
  userId: string,
  updates: Partial<AgentProfile>
): Promise<AgentProfile> => {
  const { data, error } = await supabase
    .from('agent_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update agent profile: ${error.message}`);
  }

  return data;
};

export const updateAgentEmail = async (
  userId: string,
  newEmail: string,
  emailConfig?: AgentEmailConfig
): Promise<AgentProfile> => {
  // Update both auth.users and agent_profiles
  const { error: authError } = await supabase.auth.updateUser({
    email: newEmail
  });

  if (authError) {
    throw new Error(`Failed to update auth email: ${authError.message}`);
  }

  const { data, error } = await supabase
    .from('agent_profiles')
    .update({
      email: newEmail,
      email_config: emailConfig
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update agent profile email: ${error.message}`);
  }

  return data;
};

export const verifyAgentEmail = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('agent_profiles')
    .update({
      email_config: { isVerified: true }
    })
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to verify agent email: ${error.message}`);
  }
};

export const getAgentByEmail = async (email: string): Promise<AgentProfile | null> => {
  const { data, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No agent found
    }
    throw new Error(`Failed to get agent by email: ${error.message}`);
  }

  return data;
};

// Mock data for development
export const getMockAgentProfiles = (): AgentProfile[] => [
  {
    id: 'agent-1',
    userId: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@doerealestate.com',
    phone: '(555) 123-4567',
    company: 'Doe Real Estate',
    website: 'https://doerealestate.com',
    bio: 'Experienced real estate agent specializing in residential properties in Austin, TX.',
    photoUrl: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    headshotUrl: 'https://via.placeholder.com/150',
    companyName: 'Doe Real Estate'
  },
  {
    id: 'agent-2',
    userId: 'user-2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@austinproperties.com',
    phone: '(555) 987-6543',
    company: 'Austin Properties',
    website: 'https://austinproperties.com',
    bio: 'Luxury property specialist with over 10 years of experience in the Austin market.',
    photoUrl: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    headshotUrl: 'https://via.placeholder.com/150',
    companyName: 'Austin Properties'
  }
]; 