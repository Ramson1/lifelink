-- Future sectors table for admin-managed sectors
create table if not exists public.lifelink_sectors (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  icon text not null default 'Star',
  color_from text not null default '#6366f1',
  color_to text not null default '#4f46e5',
  tagline text not null default '',
  overview jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  accepting_registrations boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for active sectors lookup
create index if not exists idx_lifelink_sectors_active on public.lifelink_sectors(is_active);
