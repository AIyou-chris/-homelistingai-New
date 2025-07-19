-- AI Control Center Tables

-- AI Personalities Table
CREATE TABLE IF NOT EXISTS ai_personalities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('sales', 'support', 'god', 'voice')),
  description TEXT,
  prompt TEXT NOT NULL,
  voice_settings JSONB,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Documents Table
CREATE TABLE IF NOT EXISTS ai_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('knowledge', 'training', 'policy', 'script')),
  brain VARCHAR(50) NOT NULL CHECK (brain IN ('sales', 'support', 'god')),
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'error')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice Configurations Table
CREATE TABLE IF NOT EXISTS voice_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  voice VARCHAR(100) NOT NULL,
  speed DECIMAL(3,2) DEFAULT 1.0,
  tone VARCHAR(50) DEFAULT 'neutral',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Brain Status Table
CREATE TABLE IF NOT EXISTS ai_brain_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brain_type VARCHAR(50) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  last_training TIMESTAMP WITH TIME ZONE,
  accuracy DECIMAL(5,2) DEFAULT 0.0,
  conversations INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analytics Table
CREATE TABLE IF NOT EXISTS ai_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  brain_type VARCHAR(50) NOT NULL,
  conversations INTEGER DEFAULT 0,
  leads_generated INTEGER DEFAULT 0,
  response_time_avg DECIMAL(5,2) DEFAULT 0.0,
  accuracy DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default voice configurations
INSERT INTO voice_configs (name, voice, speed, tone, is_default) VALUES
  ('Professional', 'alloy', 1.0, 'professional', true),
  ('Friendly', 'nova', 1.1, 'friendly', false),
  ('Energetic', 'echo', 1.2, 'energetic', false),
  ('Calm', 'fable', 0.9, 'calm', false);

-- Insert default AI brain status
INSERT INTO ai_brain_status (brain_type, active, last_training, accuracy) VALUES
  ('sales', true, NOW() - INTERVAL '2 days', 94.0),
  ('support', true, NOW() - INTERVAL '1 day', 92.0),
  ('god', true, NOW() - INTERVAL '3 days', 96.0);

-- Insert some sample AI personalities
INSERT INTO ai_personalities (name, type, description, prompt, is_active) VALUES
  ('Sales Expert', 'sales', 'Professional real estate sales personality', 'You are an expert real estate agent with 15 years of experience. You help clients find their perfect home and guide them through the buying process with professionalism and care.', true),
  ('Support Specialist', 'support', 'Customer support and assistance personality', 'You are a helpful customer support specialist who assists users with questions about properties, listings, and general inquiries.', true),
  ('AI Assistant', 'god', 'General AI assistant for all tasks', 'You are a comprehensive AI assistant that can help with any task related to real estate, property management, and customer service.', true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_personalities_type ON ai_personalities(type);
CREATE INDEX IF NOT EXISTS idx_ai_personalities_active ON ai_personalities(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_documents_brain ON ai_documents(brain);
CREATE INDEX IF NOT EXISTS idx_ai_documents_status ON ai_documents(status);
CREATE INDEX IF NOT EXISTS idx_voice_configs_default ON voice_configs(is_default);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_date ON ai_analytics(date);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_brain ON ai_analytics(brain_type);

-- Enable Row Level Security
ALTER TABLE ai_personalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_brain_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to manage AI personalities" ON ai_personalities;
DROP POLICY IF EXISTS "Allow authenticated users to manage AI documents" ON ai_documents;
DROP POLICY IF EXISTS "Allow authenticated users to manage voice configs" ON voice_configs;
DROP POLICY IF EXISTS "Allow authenticated users to view brain status" ON ai_brain_status;
DROP POLICY IF EXISTS "Allow authenticated users to view analytics" ON ai_analytics;

CREATE POLICY "Allow authenticated users to manage AI personalities" ON ai_personalities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage AI documents" ON ai_documents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage voice configs" ON voice_configs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view brain status" ON ai_brain_status
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to view analytics" ON ai_analytics
  FOR SELECT USING (auth.role() = 'authenticated'); 