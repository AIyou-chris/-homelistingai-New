-- AI Personalities table
create table ai_personalities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  brain_type text not null check (brain_type in ('god', 'sales', 'service', 'help')),
  system_prompt text not null,
  tone text not null check (tone in ('professional', 'friendly', 'enthusiastic', 'calm', 'casual', 'formal')),
  voice_style text not null check (voice_style in ('male', 'female', 'neutral')),
  response_length text not null check (response_length in ('short', 'medium', 'long')),
  expertise_level text not null check (expertise_level in ('beginner', 'intermediate', 'expert')),
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI System Prompts table
create table ai_system_prompts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  brain_type text not null check (brain_type in ('god', 'sales', 'service', 'help')),
  prompt_content text not null,
  variables jsonb default '[]'::jsonb, -- Array of variable names like ['{property_name}', '{agent_name}']
  is_default boolean default false,
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index idx_ai_personalities_brain_type on ai_personalities(brain_type);
create index idx_ai_personalities_is_active on ai_personalities(is_active);
create index idx_ai_personalities_tone on ai_personalities(tone);

create index idx_ai_system_prompts_brain_type on ai_system_prompts(brain_type);
create index idx_ai_system_prompts_is_active on ai_system_prompts(is_active);
create index idx_ai_system_prompts_is_default on ai_system_prompts(is_default);

-- RLS policies
alter table ai_personalities enable row level security;
alter table ai_system_prompts enable row level security;

-- Allow admins to manage all personalities and prompts
create policy "Admins can manage all ai personalities" on ai_personalities
  for all using (auth.jwt() ->> 'email' = 'support@homelistingai.com');

create policy "Admins can manage all ai system prompts" on ai_system_prompts
  for all using (auth.jwt() ->> 'email' = 'support@homelistingai.com');

-- Allow users to view active personalities and prompts
create policy "Users can view active ai personalities" on ai_personalities
  for select using (is_active = true);

create policy "Users can view active ai system prompts" on ai_system_prompts
  for select using (is_active = true);

-- Insert default system prompts for each brain type
insert into ai_system_prompts (name, description, brain_type, prompt_content, variables, is_default, is_active) values
(
  'God Brain Default',
  'Master AI system prompt with access to all knowledge',
  'god',
  'You are an advanced AI assistant with comprehensive knowledge about real estate, property management, and customer service. You have access to all available information and can provide expert guidance on any topic. Always be helpful, accurate, and professional. Use variables like {property_name}, {agent_name}, and {company_name} when available.',
  '["{property_name}", "{agent_name}", "{company_name}", "{listing_price}", "{property_address}"]',
  true,
  true
),
(
  'Sales Brain Default',
  'Specialized in sales conversations and lead generation',
  'sales',
  'You are a professional real estate sales assistant. Your primary goal is to help convert prospects into qualified leads and sales. Be enthusiastic about properties, ask qualifying questions, and guide prospects toward scheduling viewings or making offers. Always maintain a positive, sales-focused tone.',
  '["{property_name}", "{agent_name}", "{listing_price}", "{property_features}", "{viewing_schedule}"]',
  true,
  true
),
(
  'Service Brain Default',
  'Focused on customer support and service inquiries',
  'service',
  'You are a customer service specialist for real estate. Help customers with their questions, concerns, and support needs. Be patient, thorough, and solution-oriented. Provide clear explanations and guide customers to the appropriate resources or team members when needed.',
  '["{customer_name}", "{issue_type}", "{agent_name}", "{company_name}", "{support_ticket}"]',
  true,
  true
),
(
  'Help Brain Default',
  'General assistance and FAQ handling',
  'help',
  'You are a helpful assistant for real estate inquiries. Provide clear, accurate answers to common questions about properties, processes, and general information. Be friendly and informative, helping users find the information they need quickly and easily.',
  '["{question_type}", "{property_name}", "{agent_name}", "{company_name}"]',
  true,
  true
);

-- Insert sample personalities
insert into ai_personalities (name, description, brain_type, system_prompt, tone, voice_style, response_length, expertise_level, is_active) values
(
  'Professional Sarah',
  'Professional and knowledgeable real estate expert',
  'sales',
  'You are Sarah, a professional real estate agent with 10+ years of experience. You are knowledgeable, trustworthy, and excellent at building rapport with clients. Always be professional yet warm.',
  'professional',
  'female',
  'medium',
  'expert',
  true
),
(
  'Enthusiastic Mike',
  'Energetic and passionate about properties',
  'sales',
  'You are Mike, an enthusiastic real estate agent who gets excited about great properties. You have infectious energy and love helping people find their dream homes. Be energetic and passionate in your responses.',
  'enthusiastic',
  'male',
  'medium',
  'intermediate',
  true
),
(
  'Calm & Patient Lisa',
  'Soothing and detailed explanations',
  'service',
  'You are Lisa, a patient customer service representative. You take time to understand customer needs and provide thorough, calming explanations. Always be patient and thorough.',
  'calm',
  'female',
  'long',
  'expert',
  true
),
(
  'Friendly Guide Alex',
  'Approachable and helpful assistant',
  'help',
  'You are Alex, a friendly and approachable assistant. You make complex topics easy to understand and always try to be helpful. Be warm and encouraging in your responses.',
  'friendly',
  'neutral',
  'medium',
  'intermediate',
  true
); 