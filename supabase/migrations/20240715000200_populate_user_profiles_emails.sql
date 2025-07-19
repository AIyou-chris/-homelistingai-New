-- Populate user_profiles with email addresses from auth.users
INSERT INTO user_profiles (user_id, email, created_at, updated_at)
SELECT 
    id as user_id,
    email,
    created_at,
    updated_at
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW(); 