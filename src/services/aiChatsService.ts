import { supabase } from '../lib/supabase';

// Types
export interface AIChat {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  session_type: 'sales' | 'support' | 'general';
  status: 'active' | 'paused' | 'ended' | 'transferred';
  start_time: string;
  end_time?: string;
  duration: number;
  messages_count: number;
  voice_enabled: boolean;
  language: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  priority: 'low' | 'medium' | 'high';
  assigned_agent?: string;
  tags: string[];
  notes?: string;
  transcript?: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AIChatMessage {
  id: string;
  chat_id: string;
  sender_type: 'user' | 'ai' | 'agent';
  sender_name?: string;
  message: string;
  timestamp: string;
  metadata?: any;
  created_at: string;
}

export interface AIChatAnalytics {
  id: string;
  chat_id: string;
  metric_name: string;
  metric_value: any;
  recorded_at: string;
  created_at: string;
}

// Get all AI chats
export const getAIChats = async (): Promise<AIChat[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chats')
      .select('*')
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching AI chats:', error);
    return [];
  }
};

// Get AI chat by ID
export const getAIChat = async (id: string): Promise<AIChat | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_chats')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching AI chat:', error);
    return null;
  }
};

// Create new AI chat
export const createAIChat = async (
  sessionType: 'sales' | 'support' | 'general' = 'general',
  voiceEnabled: boolean = false,
  language: string = 'en'
): Promise<AIChat | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('ai_chats')
      .insert({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        user_email: user.email,
        session_type: sessionType,
        status: 'active',
        voice_enabled: voiceEnabled,
        language,
        sentiment: 'neutral',
        priority: 'medium',
        assigned_agent: `AI ${sessionType.charAt(0).toUpperCase() + sessionType.slice(1)} Bot`,
        tags: [],
        notes: ''
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating AI chat:', error);
    return null;
  }
};

// Update AI chat
export const updateAIChat = async (
  id: string,
  updates: Partial<AIChat>
): Promise<AIChat | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_chats')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating AI chat:', error);
    return null;
  }
};

// End AI chat
export const endAIChat = async (id: string): Promise<AIChat | null> => {
  try {
    const endTime = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('ai_chats')
      .update({
        status: 'ended',
        end_time: endTime,
        duration: Math.floor((new Date(endTime).getTime() - new Date().getTime()) / 1000)
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error ending AI chat:', error);
    return null;
  }
};

// Get chat messages
export const getChatMessages = async (chatId: string): Promise<AIChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};

// Add message to chat
export const addChatMessage = async (
  chatId: string,
  senderType: 'user' | 'ai' | 'agent',
  message: string,
  senderName?: string,
  metadata?: any
): Promise<AIChatMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_messages')
      .insert({
        chat_id: chatId,
        sender_type: senderType,
        sender_name: senderName,
        message,
        metadata: metadata || {}
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update message count in chat
    await supabase
      .from('ai_chats')
      .update({
        messages_count: supabase.rpc('increment', { row_id: chatId, column_name: 'messages_count' })
      })
      .eq('id', chatId);
    
    return data;
  } catch (error) {
    console.error('Error adding chat message:', error);
    return null;
  }
};

// Get chat analytics
export const getChatAnalytics = async (chatId: string): Promise<AIChatAnalytics[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_analytics')
      .select('*')
      .eq('chat_id', chatId)
      .order('recorded_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching chat analytics:', error);
    return [];
  }
};

// Add chat analytics
export const addChatAnalytics = async (
  chatId: string,
  metricName: string,
  metricValue: any
): Promise<AIChatAnalytics | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_chat_analytics')
      .insert({
        chat_id: chatId,
        metric_name: metricName,
        metric_value: metricValue
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding chat analytics:', error);
    return null;
  }
};

// Get chat statistics
export const getChatStats = async () => {
  try {
    const { data, error } = await supabase
      .from('ai_chats')
      .select('status, session_type, sentiment');
    
    if (error) throw error;
    
    const stats = {
      total: data?.length || 0,
      active: data?.filter((c: any) => c.status === 'active').length || 0,
      ended: data?.filter((c: any) => c.status === 'ended').length || 0,
      sales: data?.filter((c: any) => c.session_type === 'sales').length || 0,
      support: data?.filter((c: any) => c.session_type === 'support').length || 0,
      positive: data?.filter((c: any) => c.sentiment === 'positive').length || 0,
      negative: data?.filter((c: any) => c.sentiment === 'negative').length || 0,
      neutral: data?.filter((c: any) => c.sentiment === 'neutral').length || 0
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching chat stats:', error);
    return {};
  }
};

// Search chats
export const searchChats = async (searchTerm: string): Promise<AIChat[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chats')
      .select('*')
      .or(`user_name.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`)
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching chats:', error);
    return [];
  }
};

// Filter chats by status
export const filterChatsByStatus = async (status: string): Promise<AIChat[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chats')
      .select('*')
      .eq('status', status)
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error filtering chats by status:', error);
    return [];
  }
};

// Filter chats by session type
export const filterChatsByType = async (sessionType: string): Promise<AIChat[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_chats')
      .select('*')
      .eq('session_type', sessionType)
      .order('start_time', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error filtering chats by type:', error);
    return [];
  }
}; 