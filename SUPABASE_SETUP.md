# Supabase Setup Guide for Memory Archive

To use Supabase instead of local storage, follow these steps:

## 1. Create a Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once the project is ready, go to **Project Settings > API** to find your `Project URL` and `anon public` key.

## 2. Environment Variables
1. Copy `.env.local.example` to `.env.local`.
2. Paste your `Project URL` and `anon public` key.

## 3. Database Schema
Go to the **SQL Editor** in the Supabase dashboard and run the following script:

```sql
-- Events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  date date not null,
  cover_image text,
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Photos table
create table photos (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade,
  image_url text not null,
  description text,
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tags table
create table tags (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

-- Junction table for Events and Tags
create table event_tags (
  event_id uuid references events(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (event_id, tag_id)
);

-- Enable RLS (Row Level Security)
-- Note: For a private archive, you should set up policies tied to auth.uid()
-- For the basic prototype, we'll keep it simple:
alter table events enable row level security;
alter table photos enable row level security;
alter table tags enable row level security;
alter table event_tags enable row level security;

-- Basic Public Access Policy (Replace with Auth-specific policies for production)
create policy "Public access" on events for all using (true);
create policy "Public access" on photos for all using (true);
create policy "Public access" on tags for all using (true);
create policy "Public access" on event_tags for all using (true);
```

## 4. Storage Setup
1. Go to **Storage** in the Supabase dashboard.
2. Create a new bucket named `memories`.
3. Set the bucket to **Public** (or configure appropriate RLS policies).

## 5. Local Development
The app will automatically detect your Supabase credentials. If they are missing or invalid, it will gracefully fall back to `localStorage` mode.
