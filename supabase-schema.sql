-- Survey Builder Database Schema
-- Run this in your Supabase SQL Editor

-- Create surveys table
create table surveys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  tags text[] default '{}',
  questions jsonb default '[]',
  question_groups jsonb default '[]',
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table surveys enable row level security;

-- Create policies for Row Level Security

-- Users can only view their own surveys
create policy "Users can view own surveys"
  on surveys for select
  using (auth.uid() = user_id);

-- Users can insert their own surveys
create policy "Users can create own surveys"
  on surveys for insert
  with check (auth.uid() = user_id);

-- Users can update their own surveys
create policy "Users can update own surveys"
  on surveys for update
  using (auth.uid() = user_id);

-- Users can delete their own surveys
create policy "Users can delete own surveys"
  on surveys for delete
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index surveys_user_id_idx on surveys(user_id);
create index surveys_published_idx on surveys(published);
create index surveys_created_at_idx on surveys(created_at desc);

-- Optional: Create a view for published surveys (useful for mobile app queries)
create or replace view published_surveys as
select 
  id,
  user_id,
  title,
  description,
  tags,
  questions,
  question_groups,
  published_at,
  created_at
from surveys
where published = true
order by published_at desc;

-- Grant access to the published surveys view
grant select on published_surveys to anon, authenticated;

