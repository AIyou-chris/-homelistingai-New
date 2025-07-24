-- Create email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'website', 'qr_scan', 'chat', 'import')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'spam')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent TIMESTAMP WITH TIME ZONE,
  total_emails_sent INTEGER DEFAULT 0,
  total_emails_opened INTEGER DEFAULT 0,
  total_emails_clicked INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email sends table (tracks individual email sends)
CREATE TABLE IF NOT EXISTS email_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES email_subscribers(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  bounce_reason TEXT,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  tracking_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email clicks table (tracks individual link clicks)
CREATE TABLE IF NOT EXISTS email_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  send_id UUID REFERENCES email_sends(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriber segments table
CREATE TABLE IF NOT EXISTS subscriber_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  filter_criteria JSONB,
  subscriber_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create segment subscribers junction table
CREATE TABLE IF NOT EXISTS segment_subscribers (
  segment_id UUID REFERENCES subscriber_segments(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES email_subscribers(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (segment_id, subscriber_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled_at ON email_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_subscriber_id ON email_sends(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_tracking_id ON email_sends(tracking_id);
CREATE INDEX IF NOT EXISTS idx_email_clicks_send_id ON email_clicks(send_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_subscriber_segments_name ON subscriber_segments(name);

-- Enable RLS on all tables
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriber_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment_subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for email_campaigns
CREATE POLICY "Users can view their own campaigns" ON email_campaigns
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can insert their own campaigns" ON email_campaigns
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own campaigns" ON email_campaigns
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own campaigns" ON email_campaigns
  FOR DELETE USING (created_by = auth.uid());

-- Create RLS policies for email_subscribers
CREATE POLICY "Users can view all subscribers" ON email_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Users can insert subscribers" ON email_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update subscribers" ON email_subscribers
  FOR UPDATE USING (true);

-- Create RLS policies for email_sends
CREATE POLICY "Users can view all email sends" ON email_sends
  FOR SELECT USING (true);

CREATE POLICY "Users can insert email sends" ON email_sends
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update email sends" ON email_sends
  FOR UPDATE USING (true);

-- Create RLS policies for email_clicks
CREATE POLICY "Users can view all email clicks" ON email_clicks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert email clicks" ON email_clicks
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for email_templates
CREATE POLICY "Users can view all templates" ON email_templates
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own templates" ON email_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON email_templates
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" ON email_templates
  FOR DELETE USING (created_by = auth.uid());

-- Create RLS policies for subscriber_segments
CREATE POLICY "Users can view all segments" ON subscriber_segments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own segments" ON subscriber_segments
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own segments" ON subscriber_segments
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own segments" ON subscriber_segments
  FOR DELETE USING (created_by = auth.uid());

-- Create RLS policies for segment_subscribers
CREATE POLICY "Users can view all segment subscribers" ON segment_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Users can insert segment subscribers" ON segment_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete segment subscribers" ON segment_subscribers
  FOR DELETE USING (true);

-- Create functions to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_email_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_email_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_subscriber_segments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_email_campaigns_updated_at();

CREATE TRIGGER update_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_email_subscribers_updated_at();

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_templates_updated_at();

CREATE TRIGGER update_subscriber_segments_updated_at
  BEFORE UPDATE ON subscriber_segments
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriber_segments_updated_at();

-- Insert some sample email templates
INSERT INTO email_templates (name, subject, html_content, text_content, category) VALUES
(
  'Welcome Email',
  'Welcome to HomeListingAI!',
  '<!DOCTYPE html><html><head><title>Welcome</title></head><body><h1>Welcome to HomeListingAI!</h1><p>Thank you for joining us. We''re excited to help you with your real estate needs.</p></body></html>',
  'Welcome to HomeListingAI!\n\nThank you for joining us. We''re excited to help you with your real estate needs.',
  'welcome'
),
(
  'Property Update',
  'New Property Alert',
  '<!DOCTYPE html><html><head><title>Property Update</title></head><body><h1>New Property Alert</h1><p>Check out this amazing new property that matches your criteria!</p></body></html>',
  'New Property Alert\n\nCheck out this amazing new property that matches your criteria!',
  'property'
),
(
  'Newsletter',
  'Real Estate Market Update',
  '<!DOCTYPE html><html><head><title>Market Update</title></head><body><h1>Real Estate Market Update</h1><p>Stay informed with the latest market trends and insights.</p></body></html>',
  'Real Estate Market Update\n\nStay informed with the latest market trends and insights.',
  'newsletter'
);

-- Insert some sample subscriber segments
INSERT INTO subscriber_segments (name, description, filter_criteria) VALUES
(
  'New Subscribers',
  'Subscribers who joined in the last 30 days',
  '{"subscribed_at": {"operator": ">=", "value": "30 days ago"}}'
),
(
  'Active Subscribers',
  'Subscribers who have opened emails in the last 90 days',
  '{"last_email_opened": {"operator": ">=", "value": "90 days ago"}}'
),
(
  'Property Buyers',
  'Subscribers interested in buying properties',
  '{"source": "property_inquiry"}'
); 