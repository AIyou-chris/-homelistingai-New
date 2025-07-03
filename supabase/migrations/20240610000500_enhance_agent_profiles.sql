-- Enhance agent_profiles table with email configuration
ALTER TABLE agent_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS email_config JSONB DEFAULT '{"type": "user_provided", "isVerified": false}'::jsonb;

-- Update existing records to populate first_name and last_name from user metadata
UPDATE agent_profiles 
SET 
  first_name = COALESCE(
    (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE auth.users.id = agent_profiles.user_id),
    'Agent'
  ),
  last_name = ''
WHERE first_name IS NULL;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_agent_profiles_email ON agent_profiles(email);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_user_id ON agent_profiles(user_id);

-- Add constraint to ensure email is unique per agent
ALTER TABLE agent_profiles 
ADD CONSTRAINT unique_agent_email UNIQUE (email);

-- Create function to validate email configuration
CREATE OR REPLACE FUNCTION validate_email_config()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure email_config is valid JSON with required fields
  IF NEW.email_config IS NOT NULL THEN
    IF NOT (NEW.email_config ? 'type' AND NEW.email_config ? 'isVerified') THEN
      RAISE EXCEPTION 'email_config must contain type and isVerified fields';
    END IF;
    
    IF NOT (NEW.email_config->>'type' IN ('user_provided', 'auto_generated', 'custom_domain')) THEN
      RAISE EXCEPTION 'email_config type must be user_provided, auto_generated, or custom_domain';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for email config validation
CREATE TRIGGER validate_email_config_trigger
  BEFORE INSERT OR UPDATE ON agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_email_config();

-- Create function to generate agent email
CREATE OR REPLACE FUNCTION generate_agent_email(
  p_first_name TEXT,
  p_last_name TEXT,
  p_company TEXT DEFAULT NULL,
  p_custom_domain TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  clean_first_name TEXT;
  clean_last_name TEXT;
  generated_email TEXT;
BEGIN
  -- Clean names (remove special characters, convert to lowercase)
  clean_first_name := lower(regexp_replace(p_first_name, '[^a-zA-Z]', '', 'g'));
  clean_last_name := lower(regexp_replace(p_last_name, '[^a-zA-Z]', '', 'g'));
  
  -- Generate email based on available information
  IF p_custom_domain IS NOT NULL THEN
    generated_email := clean_first_name || '.' || clean_last_name || '@' || p_custom_domain;
  ELSIF p_company IS NOT NULL THEN
    -- Extract domain from company (simple logic - you might want more sophisticated)
    generated_email := clean_first_name || '.' || clean_last_name || '@' || 
                      regexp_replace(lower(p_company), '[^a-zA-Z0-9.-]', '', 'g') || '.com';
  ELSE
    generated_email := clean_first_name || '.' || clean_last_name || '@homelistingai.com';
  END IF;
  
  RETURN generated_email;
END;
$$ LANGUAGE plpgsql;

-- Create function to update agent email configuration
CREATE OR REPLACE FUNCTION update_agent_email_config(
  p_user_id UUID,
  p_new_email TEXT,
  p_email_type TEXT DEFAULT 'user_provided',
  p_domain TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE agent_profiles 
  SET 
    email = p_new_email,
    email_config = jsonb_build_object(
      'type', p_email_type,
      'email', p_new_email,
      'domain', p_domain,
      'isVerified', false
    )
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Agent profile not found for user_id: %', p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION generate_agent_email(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION update_agent_email_config(UUID, TEXT, TEXT, TEXT) TO authenticated; 