-- Shared Avatar Coin / Crown design registry.
-- Local records use the same v2 schema and can be synchronized after auth is deployed.
-- A marker registration records claimed rights and usage terms; it does not itself
-- create or prove a government trademark registration.

create type public.avatar_visibility as enum ('private', 'unlisted', 'public');
create type public.avatar_design_status as enum ('draft', 'published', 'suspended', 'archived');
create type public.avatar_creation_mode as enum ('human', 'assisted', 'adaptive');

create table public.avatar_identities (
  crown_id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null unique references auth.users(id),
  display_name text,
  wallet_reference text,
  recovery_state text not null default 'account',
  created_at timestamptz not null default now()
);

create table public.avatar_marker_registry (
  id uuid primary key default gen_random_uuid(),
  site_id text not null unique,
  site_name text not null,
  marker_symbol text not null,
  marker_label text not null,
  owner_user_id uuid references auth.users(id),
  owner_company_id uuid references public.companies(id),
  rights_basis text not null,
  registration_jurisdiction text,
  registration_number text,
  usage_terms text not null,
  portal_module_version text not null default 'avatar-coin-design/v2',
  active boolean not null default false,
  created_at timestamptz not null default now(),
  check (owner_user_id is not null or owner_company_id is not null)
);

create table public.avatar_designs (
  id uuid primary key default gen_random_uuid(),
  crown_id uuid not null references public.avatar_identities(crown_id),
  site_id text not null references public.avatar_marker_registry(site_id),
  name text not null,
  scope text not null check (scope in ('network', 'site', 'channel', 'component')),
  target_key text not null,
  target_label text not null,
  creation_mode public.avatar_creation_mode not null,
  visibility public.avatar_visibility not null default 'private',
  license text not null default 'all-rights-reserved',
  forked_from_version_id uuid,
  status public.avatar_design_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.avatar_design_versions (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.avatar_designs(id),
  version integer not null check (version > 0),
  parent_version_id uuid references public.avatar_design_versions(id),
  settings jsonb not null,
  change_request text,
  provenance jsonb not null default '{}'::jsonb,
  version_hash text not null unique,
  created_at timestamptz not null default now(),
  unique(design_id, version)
);

alter table public.avatar_designs
  add constraint avatar_designs_fork_source_fk
  foreign key (forked_from_version_id) references public.avatar_design_versions(id);

create table public.avatar_design_installations (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.avatar_design_versions(id),
  installer_crown_id uuid not null references public.avatar_identities(crown_id),
  installed_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  removed_at timestamptz,
  unique(version_id, installer_crown_id)
);

create table public.avatar_design_reactions (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.avatar_design_versions(id),
  crown_id uuid not null references public.avatar_identities(crown_id),
  reaction text not null check (reaction in ('like')),
  created_at timestamptz not null default now(),
  unique(version_id, crown_id, reaction)
);

create view public.avatar_design_catalog as
select
  d.id as design_id,
  d.name,
  d.site_id,
  d.scope,
  d.target_label,
  d.creation_mode,
  d.license,
  d.forked_from_version_id,
  v.id as current_version_id,
  v.version,
  v.version_hash,
  v.settings,
  v.provenance,
  v.created_at,
  count(distinct i.id) filter (where i.removed_at is null) as active_installs,
  count(distinct r.id) as likes
from public.avatar_designs d
join public.avatar_design_versions v on v.design_id = d.id
left join public.avatar_design_versions newer
  on newer.design_id = v.design_id and newer.version > v.version
left join public.avatar_design_installations i on i.version_id = v.id
left join public.avatar_design_reactions r on r.version_id = v.id
where d.status = 'published'
  and d.visibility = 'public'
  and newer.id is null
group by d.id, v.id;

alter table public.avatar_identities enable row level security;
alter table public.avatar_marker_registry enable row level security;
alter table public.avatar_designs enable row level security;
alter table public.avatar_design_versions enable row level security;
alter table public.avatar_design_installations enable row level security;
alter table public.avatar_design_reactions enable row level security;

create policy "owners read their Crown identity"
on public.avatar_identities for select to authenticated
using (owner_user_id = auth.uid());

create policy "active markers are public"
on public.avatar_marker_registry for select
using (active = true);

create policy "published Avatar designs are public"
on public.avatar_designs for select
using (
  (status = 'published' and visibility in ('public', 'unlisted'))
  or exists (
    select 1 from public.avatar_identities i
    where i.crown_id = avatar_designs.crown_id and i.owner_user_id = auth.uid()
  )
);

create policy "published Avatar versions are public"
on public.avatar_design_versions for select
using (
  exists (
    select 1 from public.avatar_designs d
    where d.id = avatar_design_versions.design_id
      and (
        (d.status = 'published' and d.visibility in ('public', 'unlisted'))
        or exists (
          select 1 from public.avatar_identities i
          where i.crown_id = d.crown_id and i.owner_user_id = auth.uid()
        )
      )
  )
);

-- Publishing, marker activation, rankings, payouts, moderation and shared writes
-- remain server operations. The service must verify authorship, rights declarations,
-- content hashes, parent links and abuse controls before accepting a public record.
