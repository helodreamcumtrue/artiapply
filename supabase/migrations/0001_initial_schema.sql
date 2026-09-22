-- ==============================================================================
-- ArticleApply Initial Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS) & Realtime Publication
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Synchronized with Supabase auth.users & Google OAuth tokens)
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    name text,
    avatar_url text,
    google_access_token text,
    google_refresh_token text,
    token_expires_at timestamptz,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 2. Campaigns Table
create table if not exists public.campaigns (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.users(id) on delete cascade,
    name text not null,
    subject text not null,
    body_template text not null,
    status text not null default 'draft' check (status in ('draft', 'queued', 'in_progress', 'completed', 'paused', 'failed')),
    total_contacts integer not null default 0,
    sent_count integer not null default 0,
    failed_count integer not null default 0,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 3. Contacts Table
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    campaign_id uuid not null references public.campaigns(id) on delete cascade,
    user_id uuid not null references public.users(id) on delete cascade,
    email text not null,
    first_name text,
    last_name text,
    company text,
    role text,
    custom_fields jsonb default '{}'::jsonb,
    status text not null default 'pending' check (status in ('pending', 'queued', 'sending', 'sent', 'failed')),
    error_message text,
    sent_at timestamptz,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- 4. Indexes for High Performance Queries
create index if not exists idx_campaigns_user_id on public.campaigns(user_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_contacts_campaign_id on public.contacts(campaign_id);
create index if not exists idx_contacts_user_id on public.contacts(user_id);
create index if not exists idx_contacts_status on public.contacts(status);
create index if not exists idx_contacts_email on public.contacts(email);

-- 5. Trigger for updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trigger_users_updated_at
    before update on public.users
    for each row execute function public.handle_updated_at();

create trigger trigger_campaigns_updated_at
    before update on public.campaigns
    for each row execute function public.handle_updated_at();

create trigger trigger_contacts_updated_at
    before update on public.contacts
    for each row execute function public.handle_updated_at();

-- 6. Trigger to automatically create or update public.users on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, name, avatar_url)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null)
    )
    on conflict (id) do update set
        email = excluded.email,
        name = coalesce(excluded.name, public.users.name),
        avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
        updated_at = now();
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert or update on auth.users
    for each row execute function public.handle_new_user();

-- 7. Analytics View
create or replace view public.campaign_analytics as
select
    c.id as campaign_id,
    c.user_id,
    c.name as campaign_name,
    c.status as campaign_status,
    c.total_contacts,
    c.sent_count,
    c.failed_count,
    count(case when cnt.status = 'pending' then 1 end) as pending_count,
    count(case when cnt.status = 'sending' then 1 end) as sending_count,
    case 
        when c.total_contacts > 0 then round((c.sent_count::numeric / c.total_contacts::numeric) * 100, 2)
        else 0
    end as progress_percentage,
    c.created_at,
    c.updated_at
from public.campaigns c
left join public.contacts cnt on c.id = cnt.campaign_id
group by c.id, c.user_id, c.name, c.status, c.total_contacts, c.sent_count, c.failed_count, c.created_at, c.updated_at;

-- 8. Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.campaigns enable row level security;
alter table public.contacts enable row level security;

-- Policies for public.users
create policy "Users can view own profile" 
    on public.users for select 
    using (auth.uid() = id);

create policy "Users can update own profile" 
    on public.users for update 
    using (auth.uid() = id);

-- Policies for public.campaigns
create policy "Users can view own campaigns" 
    on public.campaigns for select 
    using (auth.uid() = user_id);

create policy "Users can create own campaigns" 
    on public.campaigns for insert 
    with check (auth.uid() = user_id);

create policy "Users can update own campaigns" 
    on public.campaigns for update 
    using (auth.uid() = user_id);

create policy "Users can delete own campaigns" 
    on public.campaigns for delete 
    using (auth.uid() = user_id);

-- Policies for public.contacts
create policy "Users can view own contacts" 
    on public.contacts for select 
    using (auth.uid() = user_id);

create policy "Users can insert own contacts" 
    on public.contacts for insert 
    with check (auth.uid() = user_id);

create policy "Users can update own contacts" 
    on public.contacts for update 
    using (auth.uid() = user_id);

create policy "Users can delete own contacts" 
    on public.contacts for delete 
    using (auth.uid() = user_id);

-- 9. Realtime Publication Setup
-- Enable Supabase Realtime for table changes on contacts and campaigns
alter publication supabase_realtime add table public.campaigns;
alter publication supabase_realtime add table public.contacts;
