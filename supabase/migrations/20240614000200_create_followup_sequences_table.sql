-- Create follow-up sequences table
CREATE TABLE IF NOT EXISTS follow_up_sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_date TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'cancelled')),
    email_subject TEXT,
    email_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_followup_sequences_lead_id ON follow_up_sequences(lead_id);
CREATE INDEX IF NOT EXISTS idx_followup_sequences_status ON follow_up_sequences(status);
CREATE INDEX IF NOT EXISTS idx_followup_sequences_scheduled_date ON follow_up_sequences(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_followup_sequences_lead_status_date ON follow_up_sequences(lead_id, status, scheduled_date);

-- Create unique constraint to prevent duplicate sequences for the same lead
CREATE UNIQUE INDEX IF NOT EXISTS idx_followup_sequences_lead_sequence ON follow_up_sequences(lead_id, sequence_number);

-- Enable RLS
ALTER TABLE follow_up_sequences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own follow-up sequences" ON follow_up_sequences
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM leads WHERE agent_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own follow-up sequences" ON follow_up_sequences
    FOR INSERT WITH CHECK (
        lead_id IN (
            SELECT id FROM leads WHERE agent_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own follow-up sequences" ON follow_up_sequences
    FOR UPDATE USING (
        lead_id IN (
            SELECT id FROM leads WHERE agent_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own follow-up sequences" ON follow_up_sequences
    FOR DELETE USING (
        lead_id IN (
            SELECT id FROM leads WHERE agent_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_followup_sequences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_followup_sequences_updated_at
    BEFORE UPDATE ON follow_up_sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_followup_sequences_updated_at(); 