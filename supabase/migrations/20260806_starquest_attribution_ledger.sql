-- StarQuest attribution, StarCoin mint-cycle, and Infinity settlement ledger
-- Apply in Supabase/Postgres after authentication is configured.
-- The browser may submit events; only trusted server workers may verify events,
-- create settlement lines, approve payouts, or mark Infinity transfers settled.

create extension if not exists pgcrypto;

create type public.sq_event_type as enum (
  'view_started', 'view_25', 'view_50', 'view_90', 'view_completed',
  'share_started', 'share_copied', 'share_completed', 'share_verified', 'share_rejected'
);
create type public.sq_verification_state as enum ('client_reported', 'pending', 'verified', 'rejected');
create type public.sq_ledger_status as enum ('pending', 'approved', 'settled', 'reversed');
create type public.sq_asset as enum ('STARCOIN', 'INFINITY');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  legal_name text not null,
  display_name text not null,
  payout_address text,
  payout_address_verified_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.content_catalog (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  company_id uuid references public.companies(id),
  title text not null,
  episode_title text,
  canonical_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.viewer_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  anonymous_session_id uuid,
  content_id uuid not null references public.content_catalog(id),
  company_id uuid references public.companies(id),
  event_type public.sq_event_type not null,
  verification_state public.sq_verification_state not null default 'client_reported',
  progress_percent numeric(5,2) check (progress_percent between 0 and 100),
  watched_seconds integer check (watched_seconds is null or watched_seconds >= 0),
  share_method text,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  dedupe_key text not null unique,
  metadata jsonb not null default '{}'::jsonb,
  check (user_id is not null or anonymous_session_id is not null)
);
create index viewer_events_user_time_idx on public.viewer_events(user_id, occurred_at desc);
create index viewer_events_company_time_idx on public.viewer_events(company_id, occurred_at desc);
create index viewer_events_content_type_idx on public.viewer_events(content_id, event_type);

create table public.starcoin_mint_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  cycle_number bigint not null,
  eligible_share_count smallint not null default 0 check (eligible_share_count between 0 and 10),
  status public.sq_ledger_status not null default 'pending',
  minted_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, cycle_number)
);

create table public.starcoin_cycle_shares (
  cycle_id uuid not null references public.starcoin_mint_cycles(id),
  event_id uuid not null unique references public.viewer_events(id),
  ordinal smallint not null check (ordinal between 1 and 10),
  primary key(cycle_id, ordinal)
);

create table public.settlement_contracts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  event_type public.sq_event_type not null,
  rate_infinity numeric(30,8) not null check (rate_infinity >= 0),
  starts_at timestamptz not null,
  ends_at timestamptz,
  requires_verified_event boolean not null default true,
  active boolean not null default true,
  terms_version text not null,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create table public.settlement_batches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  period_start timestamptz not null,
  period_end timestamptz not null,
  asset public.sq_asset not null default 'INFINITY',
  total_amount numeric(30,8) not null default 0 check (total_amount >= 0),
  status public.sq_ledger_status not null default 'pending',
  payout_address_snapshot text,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  transaction_reference text unique,
  settled_at timestamptz,
  created_at timestamptz not null default now(),
  check (period_end > period_start)
);

create table public.settlement_lines (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.settlement_batches(id),
  contract_id uuid not null references public.settlement_contracts(id),
  event_id uuid not null unique references public.viewer_events(id),
  amount numeric(30,8) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create table public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('user', 'company', 'treasury')),
  user_id uuid references auth.users(id),
  company_id uuid references public.companies(id),
  asset public.sq_asset not null,
  amount numeric(30,8) not null,
  status public.sq_ledger_status not null default 'pending',
  reference_type text not null,
  reference_id uuid not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  settled_at timestamptz,
  check (
    (owner_type = 'user' and user_id is not null and company_id is null)
    or (owner_type = 'company' and company_id is not null and user_id is null)
    or (owner_type = 'treasury' and user_id is null and company_id is null)
  )
);

alter table public.companies enable row level security;
alter table public.content_catalog enable row level security;
alter table public.viewer_events enable row level security;
alter table public.starcoin_mint_cycles enable row level security;
alter table public.starcoin_cycle_shares enable row level security;
alter table public.settlement_contracts enable row level security;
alter table public.settlement_batches enable row level security;
alter table public.settlement_lines enable row level security;
alter table public.wallet_ledger enable row level security;

create policy "public can read active content"
on public.content_catalog for select using (true);

create policy "users can insert their own viewer events"
on public.viewer_events for insert to authenticated
with check (auth.uid() = user_id and verification_state = 'client_reported');

create policy "users can read their own viewer events"
on public.viewer_events for select to authenticated
using (auth.uid() = user_id);

create policy "users can read their StarCoin cycles"
on public.starcoin_mint_cycles for select to authenticated
using (auth.uid() = user_id);

create policy "users can read their wallet entries"
on public.wallet_ledger for select to authenticated
using (auth.uid() = user_id);

-- No client policies permit event verification, minting, settlement construction,
-- approval, or payout completion. Those operations belong in reviewed server-side
-- functions using the service role and an external allowlisted payout signer.
