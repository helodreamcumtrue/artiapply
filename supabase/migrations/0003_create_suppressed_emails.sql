-- ==============================================================================
-- Migration 0003: Dedicated Standalone Suppression Registry
-- Creates public.suppressed_emails table to permanently record opt-outs and bounces.
-- This table is decoupled from campaigns/contacts to ensure campaign deletion
-- can NEVER remove suppression records.
-- ==============================================================================

create table if not exists public.suppressed_emails (
    email text primary key,
    reason text default 'unsubscribed',
    source text default 'user_opt_out',
    contact_id text,
    campaign_id text,
    ip_address text,
    user_agent text,
    suppressed_at timestamptz default now() not null,
    created_at timestamptz default now() not null
);

-- Index for chronological queries and audit reporting
create index if not exists idx_suppressed_emails_suppressed_at on public.suppressed_emails(suppressed_at);

-- Enable Row Level Security (RLS)
alter table public.suppressed_emails enable row level security;

-- Strictly server-only service_role access policy.
-- Anonymous / browser users have NO access to view or modify this table.
-- Supabase service_role key bypasses RLS and handles all writes/reads securely on the backend.
comment on table public.suppressed_emails is 'Durable global opt-out and suppression registry for email compliance (CAN-SPAM/GDPR/Google OAuth).';
