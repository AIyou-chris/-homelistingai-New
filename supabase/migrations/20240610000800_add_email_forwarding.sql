-- Add email forwarding functionality to agent_profiles
ALTER TABLE agent_profiles 
ADD COLUMN IF NOT EXISTS forwarding_email TEXT,
ADD COLUMN IF NOT EXISTS unique_email_address TEXT,
ADD COLUMN IF NOT EXISTS email_forwarding_enabled BOOLEAN DEFAULT false;

-- Create index for forwarding email lookups
CREATE INDEX IF NOT EXISTS idx_agent_profiles_forwarding_email ON agent_profiles(forwarding_email);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_unique_email ON agent_profiles(unique_email_address);

-- Update email_config to include forwarding settings
ALTER TABLE agent_profiles 
ALTER COLUMN email_config SET DEFAULT '{"type": "user_provided", "isVerified": false, "forwardingEnabled": false}'::jsonb;

-- Create function to generate unique email address for agent
CREATE OR REPLACE FUNCTION generate_unique_agent_email(
  p_user_id UUID,
  p_first_name TEXT,
  p_last_name TEXT
)
RETURNS TEXT AS $$
DECLARE
  clean_first_name TEXT;
  clean_last_name TEXT;
  base_email TEXT;
  unique_email TEXT;
  counter INTEGER := 0;
BEGIN
  -- Clean names (remove special characters, convert to lowercase)
  clean_first_name := lower(regexp_replace(p_first_name, '[^a-zA-Z]', '', 'g'));
  clean_last_name := lower(regexp_replace(p_last_name, '[^a-zA-Z]', '', 'g'));
  
  -- Generate base email
  base_email := clean_first_name || '.' || clean_last_name || '@homelistingai.com';
  
  -- Check if email exists and generate unique version
  unique_email := base_email;
  WHILE EXISTS (SELECT 1 FROM agent_profiles WHERE unique_email_address = unique_email) LOOP
    counter := counter + 1;
    unique_email := clean_first_name || '.' || clean_last_name || counter::TEXT || '@homelistingai.com';
  END LOOP;
  
  RETURN unique_email;
END;
$$ LANGUAGE plpgsql;

-- Create function to enable email forwarding
CREATE OR REPLACE FUNCTION enable_email_forwarding(
  p_user_id UUID,
  p_forwarding_email TEXT
)
RETURNS VOID AS $$
DECLARE
  agent_record RECORD;
BEGIN
  -- Get agent profile
  SELECT * INTO agent_record FROM agent_profiles WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Agent profile not found for user_id: %', p_user_id;
  END IF;
  
  -- Generate unique email if not exists
  IF agent_record.unique_email_address IS NULL THEN
    UPDATE agent_profiles 
    SET unique_email_address = generate_unique_agent_email(p_user_id, agent_record.first_name, agent_record.last_name)
    WHERE user_id = p_user_id;
  END IF;
  
  -- Update forwarding settings
  UPDATE agent_profiles 
  SET 
    forwarding_email = p_forwarding_email,
    email_forwarding_enabled = true,
    email_config = jsonb_set(
      COALESCE(email_config, '{}'::jsonb),
      '{forwardingEnabled}',
      'true'::jsonb
    )
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to disable email forwarding
CREATE OR REPLACE FUNCTION disable_email_forwarding(
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE agent_profiles 
  SET 
    email_forwarding_enabled = false,
    email_config = jsonb_set(
      COALESCE(email_config, '{}'::jsonb),
      '{forwardingEnabled}',
      'false'::jsonb
    )
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Agent profile not found for user_id: %', p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION generate_unique_agent_email(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION enable_email_forwarding(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION disable_email_forwarding(UUID) TO authenticated; 