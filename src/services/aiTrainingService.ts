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