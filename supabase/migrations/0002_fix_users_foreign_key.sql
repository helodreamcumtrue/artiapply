-- ==============================================================================
-- Migration 0002: Fix Foreign Key Constraint on public.users
-- Allows Google OAuth and standalone application users to be created cleanly
-- without requiring a pre-existing record in Supabase auth.users.
-- ==============================================================================

-- 1. Drop the foreign key constraint linking public.users.id strictly to auth.users.id
alter table if exists public.users drop constraint if exists users_id_fkey;

-- 2. Make id column default to a new UUID if not provided
alter table if exists public.users alter column id set default gen_random_uuid();

-- 3. Ensure email has a unique constraint for upsert operations
alter table if exists public.users drop constraint if exists users_email_key;
alter table if exists public.users add constraint users_email_key unique (email);

-- 4. Seed the active user so campaign foreign keys always resolve immediately
insert into public.users (email, name)
values ('dreamycrafts56@gmail.com', 'Alex Outreach')
on conflict (email) do nothing;
