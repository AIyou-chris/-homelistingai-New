-- Create advanced follow-up system tables

-- Follow-up sequences table
CREATE TABLE IF NOT EXISTS followup_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('lead_capture', 'appointment_scheduled', 'property_viewed', 'market_update', 'custom')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  total_steps INTEGER DEFAULT 0,
  average_conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-up steps table
CREATE TABLE IF NOT EXISTS followup_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID REFERENCES followup_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('email', 'sms', 'call', 'social', 'ai_chat')),
  delay_hours INTEGER DEFAULT 0,
  delay_days INTEGER DEFAULT 0,
  subject TEXT,
  content_template TEXT NOT NULL,
  ai_prompt TEXT,
  personalization_fields TEXT[],
  conditions JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead follow-up tracking table
CREATE TABLE IF NOT EXISTS lead_followups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  sequence_id UUID REFERENCES followup_sequences(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'converted', 'unsubscribed')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_contact_date TIMESTAMP WITH TIME ZONE,
  engagement_score INTEGER DEFAULT 0,
  ai_insights JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-up interactions table
CREATE TABLE IF NOT EXISTS followup_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_followup_id UUID REFERENCES lead_followups(id) ON DELETE CASCADE,
  step_id UUID REFERENCES followup_steps(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email_sent', 'email_opened', 'email_clicked', 'sms_sent', 'sms_delivered', 'call_made', 'call_answered', 'ai_chat_started', 'ai_chat_engaged')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'failed', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  response_data JSONB DEFAULT '{}',
  ai_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI lead scoring table
CREATE TABLE IF NOT EXISTS ai_lead_scoring (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  score_factors JSONB DEFAULT '{}',
  predicted_conversion_probability DECIMAL(5,2) DEFAULT 0.00,
  recommended_actions TEXT[],
  ai_insights TEXT,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI content generation logs
CREATE TABLE IF NOT EXISTS ai_content_generation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('email', 'sms', 'call_script', 'social_post', 'property_update')),
  original_prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  personalization_data JSONB DEFAULT '{}',
  ai_model_used TEXT,
  tokens_used INTEGER,
  generation_time_ms INTEGER,
  quality_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_followup_sequences_trigger_type ON followup_sequences(trigger_type);
CREATE INDEX IF NOT EXISTS idx_followup_steps_sequence_id ON followup_steps(sequence_id);
CREATE INDEX IF NOT EXISTS idx_lead_followups_lead_id ON lead_followups(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_followups_status ON lead_followups(status);
CREATE INDEX IF NOT EXISTS idx_lead_followups_next_contact ON lead_followups(next_contact_date);
CREATE INDEX IF NOT EXISTS idx_followup_interactions_lead_followup_id ON followup_interactions(lead_followup_id);
CREATE INDEX IF NOT EXISTS idx_ai_lead_scoring_lead_id ON ai_lead_scoring(lead_id);
CREATE INDEX IF NOT EXISTS idx_ai_lead_scoring_score ON ai_lead_scoring(score);

-- Enable RLS
ALTER TABLE followup_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE followup_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_lead_scoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_generation ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Agents can manage their followup sequences" ON followup_sequences
  FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Agents can manage their followup steps" ON followup_steps
  FOR ALL USING (
    sequence_id IN (
      SELECT id FROM followup_sequences WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Agents can view their lead followups" ON lead_followups
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE listing_id IN (
        SELECT id FROM listings WHERE agent_id = auth.uid()
      )
    )
  );

CREATE POLICY "Agents can manage their lead followups" ON lead_followups
  FOR ALL USING (
    lead_id IN (
      SELECT id FROM leads WHERE listing_id IN (
        SELECT id FROM listings WHERE agent_id = auth.uid()
      )
    )
  );

CREATE POLICY "Agents can view their followup interactions" ON followup_interactions
  FOR SELECT USING (
    lead_followup_id IN (
      SELECT id FROM lead_followups WHERE lead_id IN (
        SELECT id FROM leads WHERE listing_id IN (
          SELECT id FROM listings WHERE agent_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Agents can view their AI lead scoring" ON ai_lead_scoring
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE listing_id IN (
        SELECT id FROM listings WHERE agent_id = auth.uid()
      )
    )
  );

CREATE POLICY "Agents can view their AI content generation" ON ai_content_generation
  FOR SELECT USING (
    lead_id IN (
      SELECT id FROM leads WHERE listing_id IN (
        SELECT id FROM listings WHERE agent_id = auth.uid()
      )
    )
  );

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_followup_sequences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_followup_steps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_lead_followups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_ai_lead_scoring_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_followup_sequences_updated_at
  BEFORE UPDATE ON followup_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_followup_sequences_updated_at();

CREATE TRIGGER update_followup_steps_updated_at
  BEFORE UPDATE ON followup_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_followup_steps_updated_at();

CREATE TRIGGER update_lead_followups_updated_at
  BEFORE UPDATE ON lead_followups
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_followups_updated_at();

CREATE TRIGGER update_ai_lead_scoring_updated_at
  BEFORE UPDATE ON ai_lead_scoring
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_lead_scoring_updated_at(); 