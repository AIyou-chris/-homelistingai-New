import { supabase } from '../lib/supabase';

export interface AIPersonality {
  id: string;
  name: string;
  type: 'sales' | 'support' | 'god' | 'voice';
  description: string;
  prompt: string;
  voiceSettings?: {
    voice: string;
    speed: number;
    tone: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUpload {
  id: string;
  name: string;
  type: 'knowledge' | 'training' | 'policy' | 'script';
  brain: 'sales' | 'support' | 'god';
  fileUrl: string;
  uploadedAt: string;
  status: 'processing' | 'active' | 'error';
  content?: string;
}

export interface VoiceConfig {
  id: string;
  name: string;
  voice: string;
  speed: number;
  tone: string;
  isDefault: boolean;
  createdAt: string;
}

export interface BrainStatus {
  active: boolean;
  lastTraining: string;
  accuracy: number;
  conversations: number;
  leads: number;
}

class AIControlService {
  // AI Personalities
  async getPersonalities(): Promise<AIPersonality[]> {
    const { data, error } = await supabase
      .from('ai_personalities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Map snake_case to camelCase
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      prompt: item.prompt,
      voiceSettings: item.voice_settings,
      isActive: item.is_active,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  }

  async createPersonality(personality: Omit<AIPersonality, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIPersonality> {
    const { data, error } = await supabase
      .from('ai_personalities')
      .insert([{
        ...personality,
        is_active: personality.isActive,
        voice_settings: personality.voiceSettings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      description: data.description,
      prompt: data.prompt,
      voiceSettings: data.voice_settings,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async updatePersonality(id: string, updates: Partial<AIPersonality>): Promise<AIPersonality> {
    const { data, error } = await supabase
      .from('ai_personalities')
      .update({
        ...updates,
        is_active: updates.isActive,
        voice_settings: updates.voiceSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      description: data.description,
      prompt: data.prompt,
      voiceSettings: data.voice_settings,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async deletePersonality(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_personalities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Document Uploads
  async getDocuments(): Promise<DocumentUpload[]> {
    const { data, error } = await supabase
      .from('ai_documents')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async uploadDocument(file: File, type: DocumentUpload['type'], brain: DocumentUpload['brain']): Promise<DocumentUpload> {
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ai-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('ai-documents')
      .getPublicUrl(fileName);

    // Create document record
    const { data, error } = await supabase
      .from('ai_documents')
      .insert([{
        name: file.name,
        type,
        brain,
        file_url: urlData.publicUrl,
        uploaded_at: new Date().toISOString(),
        status: 'processing'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('ai_documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Voice Configurations
  async getVoiceConfigs(): Promise<VoiceConfig[]> {
    const { data, error } = await supabase
      .from('voice_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createVoiceConfig(config: Omit<VoiceConfig, 'id' | 'createdAt'>): Promise<VoiceConfig> {
    const { data, error } = await supabase
      .from('voice_configs')
      .insert([{
        ...config,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateVoiceConfig(id: string, updates: Partial<VoiceConfig>): Promise<VoiceConfig> {
    const { data, error } = await supabase
      .from('voice_configs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Brain Status
  async getBrainStatus(): Promise<Record<string, BrainStatus>> {
    const { data, error } = await supabase
      .from('ai_brain_status')
      .select('*');

    if (error) throw error;

    const status: Record<string, BrainStatus> = {};
    data?.forEach((brain: any) => {
      status[brain.brain_type] = {
        active: brain.active,
        lastTraining: brain.last_training,
        accuracy: brain.accuracy,
        conversations: brain.conversations,
        leads: brain.leads
      };
    });

    return status;
  }

  async updateBrainStatus(brainType: string, status: Partial<BrainStatus>): Promise<void> {
    const { error } = await supabase
      .from('ai_brain_status')
      .upsert([{
        brain_type: brainType,
        ...status,
        updated_at: new Date().toISOString()
      }]);

    if (error) throw error;
  }

  // AI Analytics
  async getAnalytics(): Promise<{
    conversations: { today: number; week: number; month: number };
    leads: { qualified: number; conversionRate: number; avgResponseTime: number };
    performance: { accuracy: number; uptime: number; trainingStatus: string };
  }> {
    // This would typically fetch from analytics tables
    // For now, returning mock data
    return {
      conversations: {
        today: 1247,
        week: 8934,
        month: 34567
      },
      leads: {
        qualified: 234,
        conversionRate: 12.4,
        avgResponseTime: 2.3
      },
      performance: {
        accuracy: 94.2,
        uptime: 99.9,
        trainingStatus: 'Active'
      }
    };
  }

  // Train AI Brains
  async trainBrain(brainType: string, documents?: string[]): Promise<void> {
    // This would trigger AI training process
    // For now, just update the last training time
    await this.updateBrainStatus(brainType, {
      lastTraining: new Date().toISOString()
    });
  }

  // Process uploaded documents
  async processDocument(documentId: string): Promise<void> {
    // This would trigger document processing and AI training
    const { error } = await supabase
      .from('ai_documents')
      .update({
        status: 'active',
        processed_at: new Date().toISOString()
      })
      .eq('id', documentId);

    if (error) throw error;
  }
}

export const aiControlService = new AIControlService(); 