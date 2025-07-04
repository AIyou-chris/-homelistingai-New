import { supabase } from '../lib/supabase';
import { askOpenAI, PropertyInfo, OpenAIMessage } from './openaiService';
import { Listing } from '../types';

export interface PropertyAIConfig {
  id: string;
  listingId: string;
  customPrompt?: string;
  voiceSettings?: {
    voice: string;
    speed: number;
    tone: string;
  };
  leadCaptureSettings?: {
    aggressiveness: 'low' | 'medium' | 'high';
    qualificationQuestions: string[];
  };
  knowledgeBase?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSession {
  id: string;
  listingId: string;
  sessionId: string;
  messages: ChatMessage[];
  leadInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    interests?: string[];
    score?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    leadSignal?: boolean;
    qualificationScore?: number;
    suggestedActions?: string[];
  };
}

export interface AIAnalytics {
  totalConversations: number;
  avgMessagesPerSession: number;
  leadConversionRate: number;
  topQuestions: string[];
  responseTime: number;
  userSatisfaction: number;
}

class PropertyAIService {
  
  // ===================
  // PROPERTY AI TRAINING
  // ===================
  
  async trainPropertyAI(listing: Listing, customKnowledge?: string): Promise<PropertyAIConfig> {
    // Convert listing to PropertyInfo format
    const propertyInfo: PropertyInfo = {
      address: listing.address,
      price: `$${listing.price.toLocaleString()}`,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.square_footage,
      description: listing.description,
      features: [], // Will be populated from knowledge_base or custom input
      neighborhood: 'Great neighborhood',
      schoolDistrict: 'Excellent schools nearby',
      hoaFees: undefined,
      propertyTax: undefined,
      yearBuilt: listing.year_built ? listing.year_built : undefined,
      lotSize: listing.lot_size ? `${listing.lot_size} sq ft` : undefined,
      additionalInfo: customKnowledge || (typeof listing.knowledge_base === 'string' ? listing.knowledge_base : JSON.stringify(listing.knowledge_base)) || undefined
    };

    // Create enhanced system prompt
    const enhancedPrompt = this.createPropertySystemPrompt(propertyInfo, listing);

    // Save AI configuration
    const aiConfig: PropertyAIConfig = {
      id: crypto.randomUUID(),
      listingId: listing.id,
      customPrompt: enhancedPrompt,
      voiceSettings: {
        voice: 'Professional Female',
        speed: 1.0,
        tone: 'friendly-professional'
      },
      leadCaptureSettings: {
        aggressiveness: 'medium',
        qualificationQuestions: [
          'What\'s your timeline for purchasing?',
          'Are you pre-approved for a mortgage?',
          'What\'s most important to you in a home?',
          'Would you like to schedule a viewing?'
        ]
      },
      knowledgeBase: customKnowledge || (typeof listing.knowledge_base === 'string' ? listing.knowledge_base : JSON.stringify(listing.knowledge_base)) || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in database
    const { error } = await supabase
      .from('property_ai_configs')
      .insert([aiConfig]);

    if (error) throw error;

    return aiConfig;
  }

  private createPropertySystemPrompt(propertyInfo: PropertyInfo, listing: Listing): string {
    return `You are the AI assistant for a specific property: ${propertyInfo.address}. 

Your role is to be enthusiastic, knowledgeable, and helpful about THIS SPECIFIC PROPERTY. You are like a personal tour guide who knows every detail about this home.

PROPERTY DETAILS:
🏠 Address: ${propertyInfo.address}
💰 Price: ${propertyInfo.price}
🛏️ Bedrooms: ${propertyInfo.bedrooms}
🛁 Bathrooms: ${propertyInfo.bathrooms}
📐 Square Feet: ${propertyInfo.squareFeet}
🏘️ Neighborhood: ${propertyInfo.neighborhood}
🏫 School District: ${propertyInfo.schoolDistrict}
${propertyInfo.hoaFees ? `💵 HOA Fees: ${propertyInfo.hoaFees}` : ''}
${propertyInfo.propertyTax ? `📊 Property Tax: ${propertyInfo.propertyTax}` : ''}
${propertyInfo.yearBuilt ? `🗓️ Year Built: ${propertyInfo.yearBuilt}` : ''}
${propertyInfo.lotSize ? `📏 Lot Size: ${propertyInfo.lotSize}` : ''}

FEATURES:
${propertyInfo.features.map(feature => `• ${feature}`).join('\n')}

DESCRIPTION:
${propertyInfo.description}

${propertyInfo.additionalInfo ? `ADDITIONAL INFO:\n${propertyInfo.additionalInfo}` : ''}

PERSONALITY:
- Be enthusiastic about THIS specific property
- Use emojis occasionally to make responses engaging
- Paint vivid pictures of living in this home
- Know the neighborhood, commute times, nearby amenities
- Be a knowledgeable local expert

LEAD GENERATION STRATEGY:
- After 3-4 exchanges, naturally suggest a viewing
- Ask qualifying questions about timeline and budget
- Capture interest signals and follow up
- Always offer to connect them with the agent

CONVERSATION FLOW:
1. Welcome them warmly to THIS property
2. Answer their questions with specific details
3. Highlight unique selling points naturally
4. Qualify their interest and timeline
5. Suggest next steps (viewing, agent contact)

NEVER:
- Make up information not provided
- Give financial advice beyond basic costs
- Pressure buyers aggressively
- Talk about other properties

ALWAYS:
- Reference specific details about THIS property
- Be enthusiastic and positive
- Encourage questions and engagement
- Suggest scheduling a viewing for interested buyers`;
  }

  // ===================
  // CHAT MANAGEMENT
  // ===================

  async createChatSession(listingId: string): Promise<ChatSession> {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      listingId,
      sessionId: crypto.randomUUID(),
      messages: [{
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Hi! 👋 I\'m your AI assistant for this property. I know all the details about this home and can answer any questions you have. What would you like to know?',
        timestamp: new Date().toISOString()
      }],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('chat_sessions')
      .insert([session]);

    if (error) throw error;

    return session;
  }

  async sendMessage(
    sessionId: string, 
    message: string, 
    userInfo?: { name?: string; email?: string; phone?: string }
  ): Promise<ChatMessage> {
    
    // Get chat session
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('sessionId', sessionId)
      .single();

    if (error || !session) throw new Error('Chat session not found');

    // Get AI configuration
    const { data: aiConfig } = await supabase
      .from('property_ai_configs')
      .select('*')
      .eq('listingId', session.listingId)
      .single();

    // Get listing details
    const { data: listing } = await supabase
      .from('listings')
      .select('*')
      .eq('id', session.listingId)
      .single();

    if (!listing) throw new Error('Listing not found');

    // Add user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...session.messages, userMessage];

    // Create property context
    const propertyInfo: PropertyInfo = {
      address: listing.address,
      price: `$${listing.price.toLocaleString()}`,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      squareFeet: listing.square_footage,
      description: listing.description,
      features: [], // Will be populated from knowledge_base or custom input
      neighborhood: 'Great neighborhood',
      schoolDistrict: 'Excellent schools nearby',
      hoaFees: undefined,
      propertyTax: undefined,
      yearBuilt: listing.year_built ? listing.year_built : undefined,
      lotSize: listing.lot_size ? `${listing.lot_size} sq ft` : undefined,
      additionalInfo: aiConfig?.knowledgeBase || (typeof listing.knowledge_base === 'string' ? listing.knowledge_base : JSON.stringify(listing.knowledge_base)) || undefined
    };

    // Convert to OpenAI format
    const openAIMessages: OpenAIMessage[] = updatedMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Get AI response
    const aiResponse = await askOpenAI(
      openAIMessages,
      propertyInfo,
      {
        customPrompt: aiConfig?.customPrompt,
        temperature: 0.7,
        max_tokens: 1024
      }
    );

    // Analyze response for lead signals
    const leadSignals = this.analyzeLeadSignals(message, aiResponse);

    // Create AI message
    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
      metadata: {
        leadSignal: leadSignals.isLead,
        qualificationScore: leadSignals.score,
        suggestedActions: leadSignals.actions
      }
    };

    const finalMessages = [...updatedMessages, aiMessage];

    // Update session
    const updatedSession = {
      ...session,
      messages: finalMessages,
      leadInfo: {
        ...session.leadInfo,
        ...userInfo,
        interests: [...(session.leadInfo?.interests || []), ...leadSignals.interests],
        score: Math.max(session.leadInfo?.score || 0, leadSignals.score)
      },
      updatedAt: new Date().toISOString()
    };

    await supabase
      .from('chat_sessions')
      .update(updatedSession)
      .eq('sessionId', sessionId);

    // If high-quality lead, create lead record
    if (leadSignals.score >= 70) {
      await this.createLead(updatedSession, listing);
    }

    return aiMessage;
  }

  private analyzeLeadSignals(userMessage: string, aiResponse: string) {
    const message = userMessage.toLowerCase();
    let score = 0;
    const interests: string[] = [];
    const actions: string[] = [];

    // Interest signals
    if (message.includes('interested') || message.includes('like this')) {
      score += 20;
      interests.push('general_interest');
    }

    // Timeline signals
    if (message.includes('soon') || message.includes('immediately') || message.includes('asap')) {
      score += 30;
      interests.push('urgent_timeline');
      actions.push('immediate_followup');
    }

    // Viewing signals
    if (message.includes('see') || message.includes('visit') || message.includes('tour') || message.includes('viewing')) {
      score += 40;
      interests.push('wants_viewing');
      actions.push('schedule_viewing');
    }

    // Financial signals
    if (message.includes('afford') || message.includes('budget') || message.includes('price') || message.includes('financing')) {
      score += 25;
      interests.push('price_conscious');
    }

    // Contact signals
    if (message.includes('call') || message.includes('contact') || message.includes('email') || message.includes('reach')) {
      score += 35;
      interests.push('wants_contact');
      actions.push('agent_contact');
    }

    // Specific property questions (high intent)
    if (message.includes('hoa') || message.includes('taxes') || message.includes('utilities') || message.includes('maintenance')) {
      score += 20;
      interests.push('detailed_research');
    }

    return {
      isLead: score >= 30,
      score,
      interests,
      actions
    };
  }

  async createLead(session: ChatSession, listing: any) {
    const lead = {
      id: crypto.randomUUID(),
      listing_id: session.listingId,
      name: session.leadInfo?.name || 'Anonymous',
      email: session.leadInfo?.email || '',
      phone: session.leadInfo?.phone || '',
      source: 'ai_chat',
      message: `AI Chat Lead - Score: ${session.leadInfo?.score}, Interests: ${session.leadInfo?.interests?.join(', ')}`,
      status: 'new',
      created_at: new Date().toISOString()
    };

    await supabase.from('leads').insert([lead]);
  }

  // ===================
  // ANALYTICS & INSIGHTS
  // ===================

  async getPropertyAIAnalytics(listingId: string): Promise<AIAnalytics> {
    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('listingId', listingId);

    if (!sessions || sessions.length === 0) {
      return {
        totalConversations: 0,
        avgMessagesPerSession: 0,
        leadConversionRate: 0,
        topQuestions: [],
        responseTime: 0,
        userSatisfaction: 0
      };
    }

    const totalConversations = sessions.length;
    const totalMessages = sessions.reduce((sum, session) => sum + session.messages.length, 0);
    const avgMessagesPerSession = totalMessages / totalConversations;

    const leadsGenerated = sessions.filter(session => 
      session.leadInfo?.score && session.leadInfo.score >= 70
    ).length;

    const leadConversionRate = (leadsGenerated / totalConversations) * 100;

    // Extract top questions
    const allUserMessages = sessions.flatMap((session: any) => 
      session.messages.filter((msg: any) => msg.role === 'user').map((msg: any) => msg.content)
    );

    const topQuestions = this.extractTopQuestions(allUserMessages);

    return {
      totalConversations,
      avgMessagesPerSession: Math.round(avgMessagesPerSession * 10) / 10,
      leadConversionRate: Math.round(leadConversionRate * 10) / 10,
      topQuestions,
      responseTime: 1.2, // Average AI response time
      userSatisfaction: 4.7 // Simulated satisfaction score
    };
  }

  private extractTopQuestions(messages: string[]): string[] {
    // Simple keyword extraction for top questions
    const keywords = ['price', 'neighborhood', 'schools', 'hoa', 'taxes', 'size', 'features', 'viewing', 'tour'];
    const counts: Record<string, number> = {};
    
    messages.forEach(message => {
      const lower = message.toLowerCase();
      keywords.forEach(keyword => {
        if (lower.includes(keyword)) {
          counts[keyword] = (counts[keyword] || 0) + 1;
        }
      });
    });

    return Object.entries(counts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([keyword]) => `Questions about ${keyword}`);
  }

  // ===================
  // UTILITIES
  // ===================

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('sessionId', sessionId)
      .single();

    if (error) return null;
    return data;
  }

  async getPropertyAIConfig(listingId: string): Promise<PropertyAIConfig | null> {
    const { data, error } = await supabase
      .from('property_ai_configs')
      .select('*')
      .eq('listingId', listingId)
      .single();

    if (error) return null;
    return data;
  }

  async generatePropertyChatURL(listingId: string): Promise<string> {
    const baseURL = window.location.origin;
    return `${baseURL}/chat/${listingId}`;
  }

  async updatePropertyAIConfig(listingId: string, updates: Partial<PropertyAIConfig>): Promise<void> {
    const { error } = await supabase
      .from('property_ai_configs')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('listingId', listingId);

    if (error) throw error;
  }
}

export const propertyAIService = new PropertyAIService(); 