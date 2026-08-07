-- Infinity purpose-coin registry, double-entry ledger, conversions, and merchant acceptance.
-- Depends on 20260806_starquest_attribution_ledger.sql.
-- Balances use integer smallest units. Exchange rates are versioned contractual rules,
-- never a browser-controlled number.

create type public.sq_asset_class as enum (
  'settlement', 'company', 'actor', 'worker', 'vendor', 'product'
);
create type public.sq_conversion_status as enum (
  'quoted', 'pending_compliance', 'approved', 'posted', 'rejected', 'expired', 'reversed'
);

create table public.purpose_assets (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z][A-Z0-9_]{1,31}$'),
  display_name text not null,
  asset_class public.sq_asset_class not null,
  issuer_company_id uuid references public.companies(id),
  issuer_user_id uuid references auth.users(id),
  decimals smallint not null default 2 check (decimals between 0 and 18),
  purpose text not null,
  redemption_terms text not null,
  transferable boolean not null default false,
  cash_convertible boolean not null default false,
  active boolean not null default false,
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  check (issuer_company_id is not null or issuer_user_id is not null or code = 'INFINITY')
);

create table public.ledger_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('user', 'company', 'merchant', 'treasury', 'escrow')),
  user_id uuid references auth.users(id),
  company_id uuid references public.companies(id),
  label text not null,
  frozen boolean not null default false,
  created_at timestamptz not null default now(),
  check (
    (owner_type = 'user' and user_id is not null and company_id is null)
    or (owner_type in ('company', 'merchant') and company_id is not null and user_id is null)
    or (owner_type in ('treasury', 'escrow') and user_id is null and company_id is null)
  )
);

create table public.ledger_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_type text not null check (transaction_type in (
    'attribution_settlement', 'compensation', 'conversion', 'merchant_purchase',
    'redemption', 'issuance', 'reversal'
  )),
  status public.sq_ledger_status not null default 'pending',
  idempotency_key text not null unique,
  source_reference_type text not null,
  source_reference_id uuid not null,
  memo text not null,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  posted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ledger_postings (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.ledger_transactions(id),
  account_id uuid not null references public.ledger_accounts(id),
  asset_id uuid not null references public.purpose_assets(id),
  amount_minor bigint not null check (amount_minor <> 0),
  created_at timestamptz not null default now()
);
create index ledger_postings_account_asset_idx
  on public.ledger_postings(account_id, asset_id, created_at desc);

create table public.conversion_policies (
  id uuid primary key default gen_random_uuid(),
  from_asset_id uuid not null references public.purpose_assets(id),
  to_asset_id uuid not null references public.purpose_assets(id),
  numerator bigint not null check (numerator > 0),
  denominator bigint not null check (denominator > 0),
  fee_basis_points integer not null default 0 check (fee_basis_points between 0 and 10000),
  starts_at timestamptz not null,
  ends_at timestamptz,
  policy_version text not null,
  terms text not null,
  requires_kyc boolean not null default false,
  requires_contract boolean not null default true,
  active boolean not null default false,
  unique(from_asset_id, to_asset_id, policy_version),
  check (ends_at is null or ends_at > starts_at)
);

create table public.conversion_orders (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.ledger_accounts(id),
  policy_id uuid not null references public.conversion_policies(id),
  from_amount_minor bigint not null check (from_amount_minor > 0),
  quoted_to_amount_minor bigint not null check (quoted_to_amount_minor > 0),
  status public.sq_conversion_status not null default 'quoted',
  quote_expires_at timestamptz not null,
  compliance_reference text,
  ledger_transaction_id uuid unique references public.ledger_transactions(id),
  created_at timestamptz not null default now()
);

create table public.product_coin_releases (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null unique references public.purpose_assets(id),
  producer_account_id uuid not null references public.ledger_accounts(id),
  product_name text not null,
  product_url text,
  supply_cap_minor bigint check (supply_cap_minor is null or supply_cap_minor > 0),
  issuance_terms text not null,
  approved_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.merchant_asset_acceptance (
  id uuid primary key default gen_random_uuid(),
  merchant_company_id uuid not null references public.companies(id),
  asset_id uuid not null references public.purpose_assets(id),
  accepted_for text not null,
  redemption_asset_id uuid references public.purpose_assets(id),
  starts_at timestamptz not null,
  ends_at timestamptz,
  active boolean not null default false,
  unique(merchant_company_id, asset_id),
  check (ends_at is null or ends_at > starts_at)
);

create table public.compensation_allocations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  recipient_account_id uuid not null references public.ledger_accounts(id),
  source_batch_id uuid not null references public.settlement_batches(id),
  asset_id uuid not null references public.purpose_assets(id),
  amount_minor bigint not null check (amount_minor > 0),
  role_label text not null,
  contract_reference text not null,
  ledger_transaction_id uuid unique references public.ledger_transactions(id),
  created_at timestamptz not null default now()
);

alter table public.purpose_assets enable row level security;
alter table public.ledger_accounts enable row level security;
alter table public.ledger_transactions enable row level security;
alter table public.ledger_postings enable row level security;
alter table public.conversion_policies enable row level security;
alter table public.conversion_orders enable row level security;
alter table public.product_coin_releases enable row level security;
alter table public.merchant_asset_acceptance enable row level security;
alter table public.compensation_allocations enable row level security;

create policy "public can read active purpose assets"
on public.purpose_assets for select using (active = true);

create policy "public can read active merchant acceptance"
on public.merchant_asset_acceptance for select using (active = true);

create policy "users can read their ledger account"
on public.ledger_accounts for select to authenticated
using (auth.uid() = user_id);

create policy "users can read their postings"
on public.ledger_postings for select to authenticated
using (
  exists (
    select 1 from public.ledger_accounts a
    where a.id = ledger_postings.account_id and a.user_id = auth.uid()
  )
);

create policy "users can read their conversions"
on public.conversion_orders for select to authenticated
using (
  exists (
    select 1 from public.ledger_accounts a
    where a.id = conversion_orders.account_id and a.user_id = auth.uid()
  )
);

-- No client INSERT/UPDATE policies are intentionally provided for assets,
-- policies, postings, conversions, compensation, or merchant settlement.
-- A reviewed server service must enforce authorization, contracts, compliance,
-- idempotency, conservation of value, and balanced postings before committing.
