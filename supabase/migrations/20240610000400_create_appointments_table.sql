-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL CHECK (preferred_time IN ('morning', 'afternoon', 'evening')),
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_listing_id ON appointments(listing_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_preferred_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_timestamp ON appointments(timestamp DESC);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agents can view appointments for their listings" ON appointments
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can insert appointments for their listings" ON appointments
  FOR INSERT WITH CHECK (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

CREATE POLICY "Agents can update appointments for their listings" ON appointments
  FOR UPDATE USING (
    listing_id IN (
      SELECT id FROM listings WHERE agent_id = auth.uid()
    )
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_appointments_updated_at(); 