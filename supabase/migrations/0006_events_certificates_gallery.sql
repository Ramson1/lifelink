-- Events table
create table if not exists lifelink_events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  location    text not null default '',
  event_date  timestamptz,
  image_url   text,
  is_upcoming boolean not null default true,
  is_active   boolean not null default true,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Certificates table
create table if not exists lifelink_certificates (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text not null default '',
  image_url   text,
  icon_emoji  text not null default '📜',
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Gallery table
create table if not exists lifelink_gallery (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  caption     text not null default '',
  category    text not null default 'general',
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table lifelink_events enable RLS;
alter table lifelink_certificates enable RLS;
alter table lifelink_gallery enable RLS;
