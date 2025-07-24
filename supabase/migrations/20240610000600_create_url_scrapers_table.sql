-- URL Scrapers table for automated website scraping
create table url_scrapers (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  brain text not null check (brain in ('god', 'sales', 'service', 'help')),
  frequency text not null check (frequency in ('once', 'daily', 'weekly', 'monthly')),
  status text not null check (status in ('active', 'paused', 'failed')) default 'active',
  last_scan timestamptz,
  created_by uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for performance
create index idx_url_scrapers_status on url_scrapers(status);
create index idx_url_scrapers_brain on url_scrapers(brain);
create index idx_url_scrapers_frequency on url_scrapers(frequency);

-- RLS policies
alter table url_scrapers enable row level security;

-- Allow admins to manage all scrapers
create policy "Admins can manage all url scrapers" on url_scrapers
  for all using (auth.jwt() ->> 'email' = 'support@homelistingai.com');

-- Allow users to view their own scrapers (if needed in future)
create policy "Users can view their own url scrapers" on url_scrapers
  for select using (auth.uid() = created_by); 