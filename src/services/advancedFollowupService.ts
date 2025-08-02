import { supabase } from '../lib/supabase';
import { askOpenAI } from './openaiService';
import { sendEmailNotification } from './notificationService';

// Types for advanced follow-up system
export interface FollowupSequence {
  id: string;
  name: string;
  description?: string;
  trigger_type: 'lead_capture' | 'appointment_scheduled' | 'property_viewed' | 'market_update' | 'custom';
  status: 'active' | 'paused' | 'archived';
  total_steps: number;
  average_conversion_rate: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FollowupStep {
  id: string;
  sequence_id: string;
  step_number: number;
  step_type: 'email' | 'sms' | 'call' | 'social' | 'ai_chat';
  delay_hours: number;
  delay_days: number;
  subject?: string;
  content_template: string;
  ai_prompt?: string;
  personalization_fields: string[];
  conditions: any;
  status: 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface LeadFollowup {
  id: string;
  lead_id: string;
  sequence_id: string;
  current_step: number;
  status: 'active' | 'paused' | 'completed' | 'converted' | 'unsubscribed';
  start_date: string;
  last_contact_date?: string;
  next_contact_date?: string;
  engagement_score: number;
  ai_insights: any;
  created_at: string;
  updated_at: string;
}

export interface AILeadScoring {
  id: string;
  lead_id: string;
  score: number;
  score_factors: any;
  predicted_conversion_probability: number;
  recommended_actions: string[];
  ai_insights?: string;
  last_calculated: string;
  created_at: string;
  updated_at: string;
}

export interface FollowupInteraction {
  id: string;
  lead_followup_id: string;
  step_id: string;
  interaction_type: 'email_sent' | 'email_opened' | 'email_clicked' | 'sms_sent' | 'sms_delivered' | 'call_made' | 'call_answered' | 'ai_chat_started' | 'ai_chat_engaged';
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
  response_data: any;
  ai_analysis: any;
  created_at: string;
}

// AI Content Generation
export interface AIContentGeneration {
  id: string;
  lead_id: string;
  content_type: 'email' | 'sms' | 'call_script' | 'social_post' | 'property_update';
  original_prompt: string;
  generated_content: string;
  personalization_data: any;
  ai_model_used?: string;
  tokens_used?: number;
  generation_time_ms?: number;
  quality_score?: number;
  created_at: string;
}

export const advancedFollowupService = {
  // ===== SEQUENCE MANAGEMENT =====
  
  // Get all follow-up sequences for current agent
  async getFollowupSequences(): Promise<FollowupSequence[]> {
    const { data, error } = await supabase
      .from('followup_sequences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching followup sequences:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new follow-up sequence
  async createFollowupSequence(sequenceData: Partial<FollowupSequence>): Promise<FollowupSequence> {
    const { data, error } = await supabase
      .from('followup_sequences')
      .insert([sequenceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating followup sequence:', error);
      throw error;
    }

    return data;
  },

  // ===== STEP MANAGEMENT =====
  
  // Get steps for a sequence
  async getFollowupSteps(sequenceId: string): Promise<FollowupStep[]> {
    const { data, error } = await supabase
      .from('followup_steps')
      .select('*')
      .eq('sequence_id', sequenceId)
      .order('step_number', { ascending: true });

    if (error) {
      console.error('Error fetching followup steps:', error);
      throw error;
    }

    return data || [];
  },

  // Create a follow-up step
  async createFollowupStep(stepData: Partial<FollowupStep>): Promise<FollowupStep> {
    const { data, error } = await supabase
      .from('followup_steps')
      .insert([stepData])
      .select()
      .single();

    if (error) {
      console.error('Error creating followup step:', error);
      throw error;
    }

    return data;
  },

  // ===== LEAD FOLLOW-UP TRACKING =====
  
  // Get active follow-ups for a lead
  async getLeadFollowups(leadId: string): Promise<LeadFollowup[]> {
    const { data, error } = await supabase
      .from('lead_followups')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lead followups:', error);
      throw error;
    }

    return data || [];
  },

  // Start a follow-up sequence for a lead
  async startFollowupSequence(leadId: string, sequenceId: string): Promise<LeadFollowup> {
    const { data, error } = await supabase
      .from('lead_followups')
      .insert([{
        lead_id: leadId,
        sequence_id: sequenceId,
        current_step: 1,
        status: 'active',
        start_date: new Date().toISOString(),
        next_contact_date: new Date().toISOString() // Will be calculated based on first step
      }])
      .select()
      .single();

    if (error) {
      console.error('Error starting followup sequence:', error);
      throw error;
    }

    // Schedule the first step
    await this.scheduleNextStep(data.id);

    return data;
  },

  // ===== AI LEAD SCORING =====
  
  // Calculate AI lead score
  async calculateLeadScore(leadId: string): Promise<AILeadScoring> {
    try {
      // Get lead data
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (!lead) throw new Error('Lead not found');

      // Get lead interactions
      const { data: interactions } = await supabase
        .from('followup_interactions')
        .select('*')
        .eq('lead_followup_id', leadId);

      // AI prompt for lead scoring
      const scoringPrompt = `
        Analyze this real estate lead and provide a score from 0-100 and conversion probability:
        
        Lead Data:
        - Name: ${lead.name}
        - Email: ${lead.email}
        - Phone: ${lead.phone}
        - Source: ${lead.source}
        - Status: ${lead.status}
        - Message: ${lead.message}
        - Created: ${lead.created_at}
        
        Interactions: ${interactions?.length || 0} total interactions
        
        Provide:
        1. Score (0-100)
        2. Conversion probability (0.00-1.00)
        3. Score factors (JSON object)
        4. Recommended actions (array of strings)
        5. AI insights (string)
        
        Format as JSON:
        {
          "score": 75,
          "conversion_probability": 0.65,
          "score_factors": {"engagement": 20, "timing": 15, "source": 10},
          "recommended_actions": ["Send immediate follow-up", "Schedule call within 24h"],
          "ai_insights": "High engagement potential based on source and timing"
        }
      `;

      const aiResponse = await askOpenAI([
        { role: 'system', content: 'You are a real estate lead scoring expert. Analyze leads and provide detailed scoring with actionable insights.' },
        { role: 'user', content: scoringPrompt }
      ]);

      const scoringData = JSON.parse(aiResponse);

      // Save AI lead scoring
      const { data: scoring, error } = await supabase
        .from('ai_lead_scoring')
        .upsert([{
          lead_id: leadId,
          score: scoringData.score,
          score_factors: scoringData.score_factors,
          predicted_conversion_probability: scoringData.conversion_probability,
          recommended_actions: scoringData.recommended_actions,
          ai_insights: scoringData.ai_insights,
          last_calculated: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      return scoring;
    } catch (error) {
      console.error('Error calculating lead score:', error);
      throw error;
    }
  },

  // ===== AI CONTENT GENERATION =====
  
  // Generate personalized content using AI
  async generateAIContent(
    leadId: string,
    contentType: 'email' | 'sms' | 'call_script' | 'social_post' | 'property_update',
    personalizationData: any
  ): Promise<AIContentGeneration> {
    try {
      // Get lead data
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (!lead) throw new Error('Lead not found');

      // Get listing data if available
      let listingData = null;
      if (lead.listing_id) {
        const { data: listing } = await supabase
          .from('listings')
          .select('*')
          .eq('id', lead.listing_id)
          .single();
        listingData = listing;
      }

      // Create AI prompt based on content type
      let aiPrompt = '';
      switch (contentType) {
        case 'email':
          aiPrompt = `
            Generate a personalized real estate follow-up email for:
            
            Lead: ${lead.name} (${lead.email})
            Source: ${lead.source}
            Message: ${lead.message}
            
            ${listingData ? `
            Property: ${listingData.title}
            Address: ${listingData.address}
            Price: $${listingData.price}
            ` : ''}
            
            Personalization: ${JSON.stringify(personalizationData)}
            
            Create a professional, warm email that:
            1. Acknowledges their interest
            2. Provides value (market insights, similar properties)
            3. Has a clear call-to-action
            4. Is personalized to their specific situation
            
            Keep it under 200 words and make it sound human and professional.
          `;
          break;
        
        case 'sms':
          aiPrompt = `
            Generate a personalized SMS follow-up for:
            
            Lead: ${lead.name}
            Source: ${lead.source}
            
            Create a short, friendly SMS (under 160 characters) that:
            1. Is personal and warm
            2. Provides quick value
            3. Has a clear next step
            4. Feels like a human text, not spam
          `;
          break;
        
        case 'call_script':
          aiPrompt = `
            Generate a call script for:
            
            Lead: ${lead.name}
            Source: ${lead.source}
            Message: ${lead.message}
            
            Create a natural call script that:
            1. Has a strong opening
            2. Addresses their specific needs
            3. Provides value
            4. Has clear next steps
            5. Sounds conversational, not scripted
          `;
          break;
      }

      const startTime = Date.now();
      const aiResponse = await askOpenAI([
        { role: 'system', content: 'You are a professional real estate agent. Create personalized, warm, and effective follow-up content.' },
        { role: 'user', content: aiPrompt }
      ]);
      const generationTime = Date.now() - startTime;

      // Save AI content generation
      const { data: contentGen, error } = await supabase
        .from('ai_content_generation')
        .insert([{
          lead_id: leadId,
          content_type: contentType,
          original_prompt: aiPrompt,
          generated_content: aiResponse,
          personalization_data: personalizationData,
          ai_model_used: 'gpt-4',
          tokens_used: aiResponse.length / 4, // Rough estimate
          generation_time_ms: generationTime,
          quality_score: 0.85 // Default quality score
        }])
        .select()
        .single();

      if (error) throw error;

      return contentGen;
    } catch (error) {
      console.error('Error generating AI content:', error);
      throw error;
    }
  },

  // ===== AUTOMATION & SCHEDULING =====
  
  // Schedule next step in a follow-up sequence
  async scheduleNextStep(leadFollowupId: string): Promise<void> {
    try {
      // Get current follow-up
      const { data: followup } = await supabase
        .from('lead_followups')
        .select('*')
        .eq('id', leadFollowupId)
        .single();

      if (!followup) throw new Error('Follow-up not found');

      // Get current step
      const { data: currentStep } = await supabase
        .from('followup_steps')
        .select('*')
        .eq('sequence_id', followup.sequence_id)
        .eq('step_number', followup.current_step)
        .single();

      if (!currentStep) {
        // No more steps, mark as completed
        await supabase
          .from('lead_followups')
          .update({ status: 'completed' })
          .eq('id', leadFollowupId);
        return;
      }

      // Calculate next contact date
      const delayMs = (currentStep.delay_days * 24 * 60 * 60 * 1000) + (currentStep.delay_hours * 60 * 60 * 1000);
      const nextContactDate = new Date(Date.now() + delayMs);

      // Update follow-up with next contact date
      await supabase
        .from('lead_followups')
        .update({ next_contact_date: nextContactDate.toISOString() })
        .eq('id', leadFollowupId);

      // Schedule the actual execution (in a real app, this would use a job queue)
      setTimeout(async () => {
        await this.executeFollowupStep(leadFollowupId, currentStep.id);
      }, delayMs);

    } catch (error) {
      console.error('Error scheduling next step:', error);
      throw error;
    }
  },

  // Execute a follow-up step
  async executeFollowupStep(leadFollowupId: string, stepId: string): Promise<void> {
    try {
      // Get follow-up and step data
      const { data: followup } = await supabase
        .from('lead_followups')
        .select('*, leads(*)')
        .eq('id', leadFollowupId)
        .single();

      const { data: step } = await supabase
        .from('followup_steps')
        .select('*')
        .eq('id', stepId)
        .single();

      if (!followup || !step) throw new Error('Follow-up or step not found');

      // Generate personalized content using AI
      const aiContent = await this.generateAIContent(
        followup.lead_id,
        step.step_type as any,
        {
          lead_name: followup.leads.name,
          lead_email: followup.leads.email,
          lead_phone: followup.leads.phone,
          lead_source: followup.leads.source,
          step_number: step.step_number
        }
      );

      // Execute the step based on type
      switch (step.step_type) {
        case 'email':
          await this.sendFollowupEmail(followup.leads.email, step.subject || 'Follow-up from HomeListingAI', aiContent.generated_content);
          break;
        
        case 'sms':
          await this.sendFollowupSMS(followup.leads.phone, aiContent.generated_content);
          break;
        
        case 'ai_chat':
          await this.startAIChat(followup.lead_id, aiContent.generated_content);
          break;
      }

      // Record interaction
      await supabase
        .from('followup_interactions')
        .insert([{
          lead_followup_id: leadFollowupId,
          step_id: stepId,
          interaction_type: `${step.step_type}_sent`,
          status: 'sent',
          sent_at: new Date().toISOString()
        }]);

      // Move to next step
      await supabase
        .from('lead_followups')
        .update({ 
          current_step: followup.current_step + 1,
          last_contact_date: new Date().toISOString()
        })
        .eq('id', leadFollowupId);

      // Schedule next step
      await this.scheduleNextStep(leadFollowupId);

    } catch (error) {
      console.error('Error executing followup step:', error);
      throw error;
    }
  },

  // ===== HELPER METHODS =====
  
  // Send follow-up email
  async sendFollowupEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      await sendEmailNotification(to, subject, content);
      console.log('✅ Follow-up email sent to:', to);
    } catch (error) {
      console.error('❌ Failed to send follow-up email:', error);
      throw error;
    }
  },

  // Send follow-up SMS (placeholder - would integrate with SMS service)
  async sendFollowupSMS(to: string, content: string): Promise<void> {
    try {
      // TODO: Integrate with SMS service like Twilio
      console.log('📱 Would send SMS to:', to, 'Content:', content);
    } catch (error) {
      console.error('❌ Failed to send follow-up SMS:', error);
      throw error;
    }
  },

  // Start AI chat (placeholder - would integrate with chat system)
  async startAIChat(leadId: string, initialMessage: string): Promise<void> {
    try {
      // TODO: Integrate with AI chat system
      console.log('🤖 Would start AI chat for lead:', leadId, 'Message:', initialMessage);
    } catch (error) {
      console.error('❌ Failed to start AI chat:', error);
      throw error;
    }
  },

  // ===== ANALYTICS =====
  
  // Get follow-up analytics
  async getFollowupAnalytics(): Promise<any> {
    try {
      const { data: followups } = await supabase
        .from('lead_followups')
        .select('*');

      const { data: interactions } = await supabase
        .from('followup_interactions')
        .select('*');

      const { data: scoring } = await supabase
        .from('ai_lead_scoring')
        .select('*');

      return {
        total_followups: followups?.length || 0,
        active_followups: followups?.filter(f => f.status === 'active').length || 0,
        converted_leads: followups?.filter(f => f.status === 'converted').length || 0,
        total_interactions: interactions?.length || 0,
        average_score: scoring?.reduce((acc, s) => acc + s.score, 0) / (scoring?.length || 1),
        conversion_rate: followups?.length ? (followups.filter(f => f.status === 'converted').length / followups.length) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting followup analytics:', error);
      throw error;
    }
  }
}; 