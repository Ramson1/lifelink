create extension if not exists "pgcrypto";

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  service_key text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  occupation text not null,
  next_of_kin_name text not null,
  next_of_kin_phone text not null,
  notes text not null default '',
  status text not null default 'new',
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists registrations_created_at_idx on public.registrations (created_at desc);
create index if not exists registrations_service_key_idx on public.registrations (service_key);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  message text not null,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

