-- Create AI chats table
CREATE TABLE IF NOT EXISTS ai_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  user_email TEXT,
  session_type TEXT NOT NULL DEFAULT 'general' CHECK (session_type IN ('sales', 'support', 'general')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'transferred')),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  voice_enabled BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assigned_agent TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  transcript TEXT,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI chat messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES ai_chats(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'ai', 'agent')),
  sender_name TEXT,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI chat analytics table
CREATE TABLE IF NOT EXISTS ai_chat_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES ai_chats(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_chats_user_id ON ai_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chats_status ON ai_chats(status);
CREATE INDEX IF NOT EXISTS idx_ai_chats_session_type ON ai_chats(session_type);
CREATE INDEX IF NOT EXISTS idx_ai_chats_start_time ON ai_chats(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_chat_id ON ai_chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_timestamp ON ai_chat_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_chat_analytics_chat_id ON ai_chat_analytics(chat_id);

-- Enable RLS on all tables
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_chats
CREATE POLICY "Users can view their own chats" ON ai_chats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chats" ON ai_chats
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own chats" ON ai_chats
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own chats" ON ai_chats
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for ai_chat_messages
CREATE POLICY "Users can view messages for their chats" ON ai_chat_messages
  FOR SELECT USING (
    chat_id IN (
      SELECT id FROM ai_chats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages for their chats" ON ai_chat_messages
  FOR INSERT WITH CHECK (
    chat_id IN (
      SELECT id FROM ai_chats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages for their chats" ON ai_chat_messages
  FOR UPDATE USING (
    chat_id IN (
      SELECT id FROM ai_chats WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for ai_chat_analytics
CREATE POLICY "Users can view analytics for their chats" ON ai_chat_analytics
  FOR SELECT USING (
    chat_id IN (
      SELECT id FROM ai_chats WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analytics for their chats" ON ai_chat_analytics
  FOR INSERT WITH CHECK (
    chat_id IN (
      SELECT id FROM ai_chats WHERE user_id = auth.uid()
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_ai_chats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_ai_chats_updated_at
  BEFORE UPDATE ON ai_chats
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_chats_updated_at();

-- Insert some sample AI chats for testing
INSERT INTO ai_chats (
  user_id,
  user_name,
  user_email,
  session_type,
  status,
  start_time,
  duration,
  messages_count,
  voice_enabled,
  language,
  sentiment,
  priority,
  assigned_agent,
  tags,
  notes
) VALUES 
(
  (SELECT id FROM auth.users LIMIT 1),
  'Test User',
  'test@homelistingai.com',
  'sales',
  'active',
  NOW() - INTERVAL '1 hour',
  1800,
  25,
  true,
  'en',
  'positive',
  'high',
  'AI Sales Bot',
  ARRAY['demo-requested', 'interested'],
  'Customer interested in AI listing features'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Support User',
  'support@homelistingai.com',
  'support',
  'ended',
  NOW() - INTERVAL '2 hours',
  900,
  15,
  false,
  'en',
  'neutral',
  'medium',
  'AI Support Bot',
  ARRAY['resolved', 'billing'],
  'Billing question resolved successfully'
); 