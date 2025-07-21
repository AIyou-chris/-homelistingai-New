import { supabase } from '../lib/supabase';
import { AgentProfile } from '../types';

export interface AgentEmailConfig {
  type: 'user_provided' | 'auto_generated' | 'custom_domain';
  email: string;
  domain?: string;
  isVerified: boolean;
  forwardingEnabled?: boolean;
}

export interface EmailForwardingConfig {
  uniqueEmailAddress: string;
  forwardingEmail: string;
  isEnabled: boolean;
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

// Email forwarding functions
export const enableEmailForwarding = async (userId: string, forwardingEmail: string): Promise<void> => {
  const { error } = await supabase.rpc('enable_email_forwarding', {
    p_user_id: userId,
    p_forwarding_email: forwardingEmail
  });

  if (error) {
    throw new Error(`Failed to enable email forwarding: ${error.message}`);
  }
};

export const disableEmailForwarding = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('disable_email_forwarding', {
    p_user_id: userId
  });

  if (error) {
    throw new Error(`Failed to disable email forwarding: ${error.message}`);
  }
};

export const getEmailForwardingConfig = async (userId: string): Promise<EmailForwardingConfig | null> => {
  const { data, error } = await supabase
    .from('agent_profiles')
    .select('unique_email_address, forwarding_email, email_forwarding_enabled')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get email forwarding config: ${error.message}`);
  }

  return {
    uniqueEmailAddress: data.unique_email_address || '',
    forwardingEmail: data.forwarding_email || '',
    isEnabled: data.email_forwarding_enabled || false
  };
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
let MOCK_AGENTS: AgentProfile[] = [
  {
    id: 'agent-1',
    user_id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@doerealestate.com',
    phone: '(555) 123-4567',
    company_name: 'Doe Real Estate',
    website: 'https://doerealestate.com',
    bio: 'Experienced real estate agent specializing in residential properties in Austin, TX.',
    avatar_url: 'https://via.placeholder.com/150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'agent-2',
    user_id: 'user-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@austinproperties.com',
    phone: '(555) 987-6543',
    company_name: 'Austin Properties',
    website: 'https://austinproperties.com',
    bio: 'Luxury property specialist with over 10 years of experience in the Austin market.',
    avatar_url: 'https://via.placeholder.com/150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const updateMockAgentProfile = (agentId: string, profileData: Partial<AgentProfile>): AgentProfile => {
  console.log("Updating profile for agent:", agentId, "with data:", profileData);
  const updatedProfile = {
    id: agentId,
    ...profileData,
    email: 'jane.doe@example.com', // Should not be updatable here
    updated_at: new Date().toISOString(),
  };
  // In a real app, you would find and update the agent in the MOCK_AGENTS array
  return updatedProfile as AgentProfile;
}; 