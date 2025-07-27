-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'message' CHECK (type IN ('message', 'appointment', 'reminder', 'system')),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_lead_id ON notifications(lead_id);
CREATE INDEX IF NOT EXISTS idx_notifications_agent_id ON notifications(agent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agents can view their own notifications" ON notifications
  FOR SELECT USING (agent_id = auth.uid());

CREATE POLICY "Agents can insert notifications for their leads" ON notifications
  FOR INSERT WITH CHECK (
    agent_id = auth.uid() AND
    lead_id IN (
      SELECT id FROM leads WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can update their own notifications" ON notifications
  FOR UPDATE USING (agent_id = auth.uid());

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at(); 