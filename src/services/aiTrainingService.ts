import { supabase } from '../lib/supabase';

export interface TrainingDocument {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'note' | 'faq' | 'file';
  brain: 'god' | 'sales' | 'service' | 'help';
  status: 'processing' | 'completed' | 'failed' | 'pending';
  file_url?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface TrainingSession {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  documents_count: number;
  processed_count: number;
  started_at: string;
  completed_at?: string;
  progress: number;
  brain_type: 'god' | 'sales' | 'service' | 'help';
}

export interface BrainType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Personality {
  id: string;
  name: string;
  description: string;
  brain_type: 'god' | 'sales' | 'service' | 'help';
  system_prompt: string;
  tone: 'professional' | 'friendly' | 'enthusiastic' | 'calm' | 'casual' | 'formal';
  voice_style: 'male' | 'female' | 'neutral';
  response_length: 'short' | 'medium' | 'long';
  expertise_level: 'beginner' | 'intermediate' | 'expert';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  brain_type: 'god' | 'sales' | 'service' | 'help';
  prompt_content: string;
  variables: string[]; // e.g., ['{property_name}', '{agent_name}', '{company_name}']
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const BRAIN_TYPES: BrainType[] = [
  {
    id: 'god',
    name: 'God Brain',
    description: 'Master AI with access to all knowledge and capabilities',
    color: 'bg-purple-500',
    icon: '🧠'
  },
  {
    id: 'sales',
    name: 'Sales Brain',
    description: 'Specialized in sales conversations and lead generation',
    color: 'bg-green-500',
    icon: '💰'
  },
  {
    id: 'service',
    name: 'Service Brain',
    description: 'Focused on customer support and service inquiries',
    color: 'bg-blue-500',
    icon: '🛠️'
  },
  {
    id: 'help',
    name: 'Help Brain',
    description: 'General assistance and FAQ handling',
    color: 'bg-orange-500',
    icon: '❓'
  }
];

export const PERSONALITY_TONES = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and excited' },
  { value: 'calm', label: 'Calm', description: 'Soothing and patient' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
  { value: 'formal', label: 'Formal', description: 'Strict and proper' }
];

export const VOICE_STYLES = [
  { value: 'male', label: 'Male Voice' },
  { value: 'female', label: 'Female Voice' },
  { value: 'neutral', label: 'Neutral Voice' }
];

export const RESPONSE_LENGTHS = [
  { value: 'short', label: 'Short', description: 'Brief and concise' },
  { value: 'medium', label: 'Medium', description: 'Balanced responses' },
  { value: 'long', label: 'Long', description: 'Detailed explanations' }
];

export const EXPERTISE_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Simple explanations' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate detail' },
  { value: 'expert', label: 'Expert', description: 'Advanced knowledge' }
];

// Training Documents
export const getTrainingDocuments = async (brainFilter?: string): Promise<TrainingDocument[]> => {
  try {
    let query = supabase
      .from('knowledge_base_entries')
      .select(`
        id,
        title,
        content,
        entry_type,
        file_url,
        created_at,
        updated_at,
        created_by,
        knowledge_bases!inner(type)
      `)
      .eq('is_current', true);

    if (brainFilter && brainFilter !== 'all') {
      query = query.eq('knowledge_bases.type', brainFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching training documents:', error);
      return [];
    }

    return data?.map((doc: any) => ({
      id: doc.id,
      title: doc.title || 'Untitled Document',
      content: doc.content || '',
      type: doc.entry_type as 'document' | 'note' | 'faq' | 'file',
      brain: doc.knowledge_bases?.type as 'god' | 'sales' | 'service' | 'help',
      status: 'completed' as const, // Default to completed since it's in the database
      file_url: doc.file_url,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      created_by: doc.created_by
    })) || [];
  } catch (error) {
    console.error('Error in getTrainingDocuments:', error);
    return [];
  }
};

export const createTrainingDocument = async (
  title: string,
  content: string,
  type: 'document' | 'note' | 'faq' | 'file',
  brain: 'god' | 'sales' | 'service' | 'help',
  fileUrl?: string
): Promise<TrainingDocument | null> => {
  try {
    // First, get or create the knowledge base for this brain type
    const { data: kbData, error: kbError } = await supabase
      .from('knowledge_bases')
      .select('id')
      .eq('type', brain)
      .single();

    let knowledgeBaseId = kbData?.id;

    if (!knowledgeBaseId) {
      // Create new knowledge base for this brain type
      const { data: newKb, error: createError } = await supabase
        .from('knowledge_bases')
        .insert({
          type: brain,
          title: `${brain.charAt(0).toUpperCase() + brain.slice(1)} Knowledge Base`
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating knowledge base:', createError);
        return null;
      }

      knowledgeBaseId = newKb.id;
    }

    // Create the training document
    const { data, error } = await supabase
      .from('knowledge_base_entries')
      .insert({
        knowledge_base_id: knowledgeBaseId,
        entry_type: type,
        title,
        content,
        file_url: fileUrl
      })
      .select(`
        id,
        title,
        content,
        entry_type,
        file_url,
        created_at,
        updated_at,
        created_by,
        knowledge_bases!inner(type)
      `)
      .single();

    if (error) {
      console.error('Error creating training document:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title || 'Untitled Document',
      content: data.content || '',
      type: data.entry_type as 'document' | 'note' | 'faq' | 'file',
      brain: data.knowledge_bases?.type as 'god' | 'sales' | 'service' | 'help',
      status: 'completed' as const,
      file_url: data.file_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by
    };
  } catch (error) {
    console.error('Error in createTrainingDocument:', error);
    return null;
  }
};

export const updateTrainingDocument = async (
  id: string,
  updates: Partial<Pick<TrainingDocument, 'title' | 'content' | 'brain'>>
): Promise<TrainingDocument | null> => {
  try {
    const { data, error } = await supabase
      .from('knowledge_base_entries')
      .update({
        title: updates.title,
        content: updates.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        title,
        content,
        entry_type,
        file_url,
        created_at,
        updated_at,
        created_by,
        knowledge_bases!inner(type)
      `)
      .single();

    if (error) {
      console.error('Error updating training document:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title || 'Untitled Document',
      content: data.content || '',
      type: data.entry_type as 'document' | 'note' | 'faq' | 'file',
      brain: data.knowledge_bases?.type as 'god' | 'sales' | 'service' | 'help',
      status: 'completed' as const,
      file_url: data.file_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by
    };
  } catch (error) {
    console.error('Error in updateTrainingDocument:', error);
    return null;
  }
};

export const deleteTrainingDocument = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('knowledge_base_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting training document:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTrainingDocument:', error);
    return false;
  }
};

// Training Sessions (for future use)
export const getTrainingSessions = async (): Promise<TrainingSession[]> => {
  // This would connect to a training_sessions table when implemented
  return [];
};

export const createTrainingSession = async (
  name: string,
  brainType: 'god' | 'sales' | 'service' | 'help'
): Promise<TrainingSession | null> => {
  // This would create a training session when implemented
  return null;
};

// File Upload
export const uploadTrainingFile = async (file: File): Promise<string | null> => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('training-files')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('training-files')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadTrainingFile:', error);
    return null;
  }
};

// Analytics
export const getTrainingStats = async () => {
  try {
    const { data, error } = await supabase
      .from('knowledge_base_entries')
      .select('id, entry_type, created_at, knowledge_bases!inner(type)');

    if (error) {
      console.error('Error fetching training stats:', error);
      return {
        totalDocuments: 0,
        documentsByBrain: { god: 0, sales: 0, service: 0, help: 0 },
        documentsByType: { document: 0, note: 0, faq: 0, file: 0 }
      };
    }

    const documents = data || [];
    const totalDocuments = documents.length;
    
    const documentsByBrain = documents.reduce((acc: Record<string, number>, doc: any) => {
      const brain = doc.knowledge_bases?.type || 'god';
      acc[brain] = (acc[brain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const documentsByType = documents.reduce((acc: Record<string, number>, doc: any) => {
      const type = doc.entry_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDocuments,
      documentsByBrain,
      documentsByType
    };
  } catch (error) {
    console.error('Error in getTrainingStats:', error);
    return {
      totalDocuments: 0,
      documentsByBrain: { god: 0, sales: 0, service: 0, help: 0 },
      documentsByType: { document: 0, note: 0, faq: 0, file: 0 }
    };
  }
};

// URL Scraper functionality
export interface UrlScraper {
  id: string;
  url: string;
  brain: 'god' | 'sales' | 'service' | 'help';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'failed';
  lastScan?: string;
  createdAt: string;
  updatedAt: string;
}

export const createUrlScraper = async (scraper: Omit<UrlScraper, 'id' | 'createdAt' | 'updatedAt'>): Promise<UrlScraper | null> => {
  try {
    const { data, error } = await supabase
      .from('url_scrapers')
      .insert({
        url: scraper.url,
        brain: scraper.brain,
        frequency: scraper.frequency,
        status: scraper.status,
        last_scan: scraper.lastScan
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating URL scraper:', error);
      return null;
    }

    return {
      id: data.id,
      url: data.url,
      brain: data.brain,
      frequency: data.frequency,
      status: data.status,
      lastScan: data.last_scan,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in createUrlScraper:', error);
    return null;
  }
};

export const getUrlScrapers = async (): Promise<UrlScraper[]> => {
  try {
    const { data, error } = await supabase
      .from('url_scrapers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching URL scrapers:', error);
      return [];
    }

    return data?.map((scraper: any) => ({
      id: scraper.id,
      url: scraper.url,
      brain: scraper.brain,
      frequency: scraper.frequency,
      status: scraper.status,
      lastScan: scraper.last_scan,
      createdAt: scraper.created_at,
      updatedAt: scraper.updated_at
    })) || [];
  } catch (error) {
    console.error('Error in getUrlScrapers:', error);
    return [];
  }
};

export const updateUrlScraper = async (id: string, updates: Partial<UrlScraper>): Promise<UrlScraper | null> => {
  try {
    const { data, error } = await supabase
      .from('url_scrapers')
      .update({
        status: updates.status,
        last_scan: updates.lastScan,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating URL scraper:', error);
      return null;
    }

    return {
      id: data.id,
      url: data.url,
      brain: data.brain,
      frequency: data.frequency,
      status: data.status,
      lastScan: data.last_scan,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in updateUrlScraper:', error);
    return null;
  }
};

export const deleteUrlScraper = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('url_scrapers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting URL scraper:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteUrlScraper:', error);
    return false;
  }
};

export const scrapeWebsite = async (url: string, brain: 'god' | 'sales' | 'service' | 'help'): Promise<string | null> => {
  try {
    // This would implement actual web scraping
    // For now, we'll simulate scraping by creating a document
    const content = `Scraped content from ${url} at ${new Date().toISOString()}`;
    
    const newDoc = await createTrainingDocument(
      `Website Content from ${url}`,
      content,
      'document',
      brain
    );

    if (newDoc) {
      return newDoc.id;
    }

    return null;
  } catch (error) {
    console.error('Error scraping website:', error);
    return null;
  }
}; 

// Personality Management
export const getPersonalities = async (brainFilter?: string): Promise<Personality[]> => {
  try {
    let query = supabase
      .from('ai_personalities')
      .select('*')
      .eq('is_active', true);

    if (brainFilter && brainFilter !== 'all') {
      query = query.eq('brain_type', brainFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching personalities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getPersonalities:', error);
    return [];
  }
};

export const createPersonality = async (
  name: string,
  description: string,
  brainType: 'god' | 'sales' | 'service' | 'help',
  systemPrompt: string,
  tone: 'professional' | 'friendly' | 'enthusiastic' | 'calm' | 'casual' | 'formal',
  voiceStyle: 'male' | 'female' | 'neutral',
  responseLength: 'short' | 'medium' | 'long',
  expertiseLevel: 'beginner' | 'intermediate' | 'expert'
): Promise<Personality | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_personalities')
      .insert({
        name,
        description,
        brain_type: brainType,
        system_prompt: systemPrompt,
        tone,
        voice_style: voiceStyle,
        response_length: responseLength,
        expertise_level: expertiseLevel,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating personality:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createPersonality:', error);
    return null;
  }
};

export const updatePersonality = async (
  id: string,
  updates: Partial<Personality>
): Promise<Personality | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_personalities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating personality:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updatePersonality:', error);
    return null;
  }
};

export const deletePersonality = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ai_personalities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting personality:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePersonality:', error);
    return false;
  }
};

// System Prompts Management
export const getSystemPrompts = async (brainFilter?: string): Promise<SystemPrompt[]> => {
  try {
    let query = supabase
      .from('ai_system_prompts')
      .select('*')
      .eq('is_active', true);

    if (brainFilter && brainFilter !== 'all') {
      query = query.eq('brain_type', brainFilter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching system prompts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSystemPrompts:', error);
    return [];
  }
};

export const createSystemPrompt = async (
  name: string,
  description: string,
  brainType: 'god' | 'sales' | 'service' | 'help',
  promptContent: string,
  variables: string[],
  isDefault: boolean = false
): Promise<SystemPrompt | null> => {
  try {
    // If this is a default prompt, deactivate other defaults for this brain type
    if (isDefault) {
      await supabase
        .from('ai_system_prompts')
        .update({ is_default: false })
        .eq('brain_type', brainType)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('ai_system_prompts')
      .insert({
        name,
        description,
        brain_type: brainType,
        prompt_content: promptContent,
        variables,
        is_default: isDefault,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating system prompt:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createSystemPrompt:', error);
    return null;
  }
};

export const updateSystemPrompt = async (
  id: string,
  updates: Partial<SystemPrompt>
): Promise<SystemPrompt | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_system_prompts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating system prompt:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateSystemPrompt:', error);
    return null;
  }
};

export const deleteSystemPrompt = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ai_system_prompts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting system prompt:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSystemPrompt:', error);
    return false;
  }
};

// Get default system prompt for a brain type
export const getDefaultSystemPrompt = async (brainType: 'god' | 'sales' | 'service' | 'help'): Promise<SystemPrompt | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_system_prompts')
      .select('*')
      .eq('brain_type', brainType)
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching default system prompt:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getDefaultSystemPrompt:', error);
    return null;
  }
};

// Get active personalities for a brain type
export const getActivePersonalities = async (brainType: 'god' | 'sales' | 'service' | 'help'): Promise<Personality[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_personalities')
      .select('*')
      .eq('brain_type', brainType)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching active personalities:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getActivePersonalities:', error);
    return [];
  }
}; 