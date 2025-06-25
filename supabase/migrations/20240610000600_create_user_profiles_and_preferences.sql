-- Create user profiles and preferences tables
-- This migration adds comprehensive user profile and preference management

-- Create user_profiles table for general user information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    date_of_birth DATE,
    occupation TEXT,
    company TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}'::jsonb, -- Instagram, LinkedIn, etc.
    location_preferences JSONB DEFAULT '{}'::jsonb, -- Preferred cities, neighborhoods
    budget_preferences JSONB DEFAULT '{}'::jsonb, -- Min/max price ranges
    property_preferences JSONB DEFAULT '{}'::jsonb, -- Bedrooms, bathrooms, property type
    is_first_time_buyer BOOLEAN DEFAULT false,
    is_investor BOOLEAN DEFAULT false,
    has_agent BOOLEAN DEFAULT false,
    agent_id UUID REFERENCES agent_profiles(id),
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table for detailed preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    
    -- Property preferences
    preferred_property_types TEXT[] DEFAULT '{}', -- house, condo, townhouse, etc.
    min_bedrooms INTEGER DEFAULT 1,
    max_bedrooms INTEGER DEFAULT 5,
    min_bathrooms DECIMAL(3,1) DEFAULT 1.0,
    max_bathrooms DECIMAL(3,1) DEFAULT 5.0,
    min_square_feet INTEGER DEFAULT 500,
    max_square_feet INTEGER DEFAULT 5000,
    min_price DECIMAL(12,2) DEFAULT 100000,
    max_price DECIMAL(12,2) DEFAULT 2000000,
    
    -- Location preferences
    preferred_cities TEXT[] DEFAULT '{}',
    preferred_neighborhoods TEXT[] DEFAULT '{}',
    preferred_zip_codes TEXT[] DEFAULT '{}',
    max_commute_time INTEGER DEFAULT 30, -- minutes
    preferred_school_districts TEXT[] DEFAULT '{}',
    
    -- Feature preferences
    must_have_features TEXT[] DEFAULT '{}', -- garage, pool, fireplace, etc.
    nice_to_have_features TEXT[] DEFAULT '{}',
    deal_breakers TEXT[] DEFAULT '{}',
    
    -- Lifestyle preferences
    lifestyle_preferences JSONB DEFAULT '{}'::jsonb, -- family-friendly, walkable, etc.
    accessibility_needs TEXT[] DEFAULT '{}',
    pet_friendly BOOLEAN DEFAULT true,
    
    -- Notification preferences
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    notification_frequency TEXT DEFAULT 'daily', -- immediate, daily, weekly
    notification_types JSONB DEFAULT '["new_listings", "price_changes", "open_houses"]'::jsonb,
    
    -- Privacy preferences
    profile_visibility TEXT DEFAULT 'public', -- public, private, agents_only
    show_contact_info BOOLEAN DEFAULT true,
    allow_agent_contact BOOLEAN DEFAULT true,
    
    -- AI and personalization preferences
    ai_recommendations_enabled BOOLEAN DEFAULT true,
    ai_chat_enabled BOOLEAN DEFAULT true,
    data_collection_consent BOOLEAN DEFAULT true,
    personalized_content BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table for saved listings
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Create user_search_alerts table for saved searches
CREATE TABLE user_search_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    search_criteria JSONB NOT NULL, -- Store the search parameters
    is_active BOOLEAN DEFAULT true,
    notification_frequency TEXT DEFAULT 'daily',
    last_notification_sent TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activity_log table for tracking user behavior
CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- view_listing, save_listing, contact_agent, etc.
    activity_data JSONB DEFAULT '{}'::jsonb, -- Additional data about the activity
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_chat_history table for AI chat sessions
CREATE TABLE user_chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    message_type TEXT NOT NULL, -- user, ai, system
    message_content TEXT NOT NULL,
    message_metadata JSONB DEFAULT '{}'::jsonb, -- Timestamps, intent, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_search_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Agents can view user profiles for leads
CREATE POLICY "Agents can view user profiles for leads"
    ON user_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.user_id = user_profiles.user_id 
            AND leads.agent_id = auth.uid()
        )
    );

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
    ON user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can view their own favorites"
    ON user_favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
    ON user_favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
    ON user_favorites FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON user_favorites FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for user_search_alerts
CREATE POLICY "Users can view their own search alerts"
    ON user_search_alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search alerts"
    ON user_search_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own search alerts"
    ON user_search_alerts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search alerts"
    ON user_search_alerts FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view their own activity"
    ON user_activity_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
    ON user_activity_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_chat_history
CREATE POLICY "Users can view their own chat history"
    ON user_chat_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
    ON user_chat_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_listing_id ON user_favorites(listing_id);
CREATE INDEX idx_user_search_alerts_user_id ON user_search_alerts(user_id);
CREATE INDEX idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created_at ON user_activity_log(created_at);
CREATE INDEX idx_user_chat_history_user_id ON user_chat_history(user_id);
CREATE INDEX idx_user_chat_history_session_id ON user_chat_history(session_id);

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_search_alerts_updated_at
    BEFORE UPDATE ON user_search_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile and preferences on signup
CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO user_profiles (user_id, first_name, last_name, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    
    -- Create user preferences
    INSERT INTO user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile and preferences on signup
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile_on_signup();

-- Function to get user preferences for AI recommendations
CREATE OR REPLACE FUNCTION get_user_preferences_for_ai(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    user_prefs JSONB;
BEGIN
    SELECT jsonb_build_object(
        'property_types', preferred_property_types,
        'bedrooms', jsonb_build_object('min', min_bedrooms, 'max', max_bedrooms),
        'bathrooms', jsonb_build_object('min', min_bathrooms, 'max', max_bathrooms),
        'price_range', jsonb_build_object('min', min_price, 'max', max_price),
        'square_feet', jsonb_build_object('min', min_square_feet, 'max', max_square_feet),
        'locations', jsonb_build_object(
            'cities', preferred_cities,
            'neighborhoods', preferred_neighborhoods,
            'zip_codes', preferred_zip_codes
        ),
        'features', jsonb_build_object(
            'must_have', must_have_features,
            'nice_to_have', nice_to_have_features,
            'deal_breakers', deal_breakers
        ),
        'lifestyle', lifestyle_preferences,
        'notifications', jsonb_build_object(
            'enabled', email_notifications,
            'frequency', notification_frequency,
            'types', notification_types
        )
    ) INTO user_prefs
    FROM user_preferences
    WHERE user_id = user_uuid;
    
    RETURN COALESCE(user_prefs, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_user_preferences_for_ai(UUID) TO authenticated; 