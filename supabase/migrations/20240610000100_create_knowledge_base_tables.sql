-- Knowledge Bases
create table knowledge_bases (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('listing', 'sales')),
  listing_id uuid references listings(id),
  title text,
  created_by uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Knowledge Base Entries
create table knowledge_base_entries (
  id uuid primary key default gen_random_uuid(),
  knowledge_base_id uuid references knowledge_bases(id),
  entry_type text not null check (entry_type in ('document', 'note', 'faq', 'file')),
  title text,
  content text,
  file_url text,
  created_by uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  version integer default 1,
  is_current boolean default true
);

-- Entry Versions
create table knowledge_base_entry_versions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid references knowledge_base_entries(id),
  content text,
  file_url text,
  created_by uuid references users(id),
  created_at timestamptz default now(),
  version integer
); 