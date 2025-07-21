-- Create property AI configurations table
CREATE TABLE property_ai_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  custom_prompt TEXT,
  voice_settings JSONB DEFAULT '{"voice": "Professional Female", "speed": 1.0, "tone": "friendly-professional"}',
  lead_capture_settings JSONB DEFAULT '{"aggressiveness": "medium", "qualificationQuestions": []}',
  knowledge_base TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(listing_id)
);

-- Create chat sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  session_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  messages JSONB DEFAULT '[]',
  lead_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_property_ai_configs_listing_id ON property_ai_configs(listing_id);
CREATE INDEX idx_property_ai_configs_is_active ON property_ai_configs(is_active);
CREATE INDEX idx_chat_sessions_listing_id ON chat_sessions(listing_id);
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_is_active ON chat_sessions(is_active);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE property_ai_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for property_ai_configs
CREATE POLICY "Users can view AI configs for their listings" ON property_ai_configs
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can create AI configs for their listings" ON property_ai_configs
  FOR INSERT WITH CHECK (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can update AI configs for their listings" ON property_ai_configs
  FOR UPDATE USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete AI configs for their listings" ON property_ai_configs
  FOR DELETE USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

-- RLS Policies for chat_sessions (more open for public chat functionality)
CREATE POLICY "Anyone can view chat sessions" ON chat_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions" ON chat_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Agents can view all chat sessions for their listings" ON chat_sessions
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_property_ai_configs_updated_at 
    BEFORE UPDATE ON property_ai_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at 
    BEFORE UPDATE ON chat_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 