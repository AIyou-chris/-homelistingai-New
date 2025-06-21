-- Create enum for listing status
CREATE TYPE listing_status AS ENUM ('active', 'pending', 'sold');

-- Create listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms DECIMAL(4,2) NOT NULL,
    square_feet INTEGER NOT NULL,
    description TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status listing_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    custom_description TEXT,
    special_features TEXT[],
    more_information TEXT
);

-- Create listing photos table
CREATE TABLE listing_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    is_scraped BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent profiles table
CREATE TABLE agent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    headshot_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for listings
CREATE POLICY "Public listings are viewable by everyone"
    ON listings FOR SELECT
    USING (true);

CREATE POLICY "Agents can insert their own listings"
    ON listings FOR INSERT
    WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update their own listings"
    ON listings FOR UPDATE
    USING (auth.uid() = agent_id);

CREATE POLICY "Agents can delete their own listings"
    ON listings FOR DELETE
    USING (auth.uid() = agent_id);

-- Policies for listing photos
CREATE POLICY "Public listing photos are viewable by everyone"
    ON listing_photos FOR SELECT
    USING (true);

CREATE POLICY "Agents can insert photos for their listings"
    ON listing_photos FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM listings
            WHERE id = listing_id
            AND agent_id = auth.uid()
        )
    );

CREATE POLICY "Agents can update photos for their listings"
    ON listing_photos FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM listings
            WHERE id = listing_id
            AND agent_id = auth.uid()
        )
    );

CREATE POLICY "Agents can delete photos for their listings"
    ON listing_photos FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM listings
            WHERE id = listing_id
            AND agent_id = auth.uid()
        )
    );

-- Policies for agent profiles
CREATE POLICY "Public agent profiles are viewable by everyone"
    ON agent_profiles FOR SELECT
    USING (true);

CREATE POLICY "Agents can insert their own profile"
    ON agent_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents can update their own profile"
    ON agent_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_profiles_updated_at
    BEFORE UPDATE ON agent_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 