-- Fundraisers table for LifeLink campaigns
create table if not exists public.lifelink_fundraisers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sector text not null default '',
  target_amount numeric not null default 0,
  current_amount numeric not null default 0,
  image_url text not null default '',
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lifelink_fundraisers_active on public.lifelink_fundraisers(is_active);
