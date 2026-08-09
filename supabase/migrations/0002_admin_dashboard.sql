-- 0002: Admin dashboard schema
-- All tables prefixed with lifelink_ for project namespacing.

-- Enable citext extension for case-insensitive email lookups
create extension if not exists citext;

-- Roles allowed in lifelink_admins.role (super_admin is hidden from admin-list queries)
-- The application enforces the allowed values; we keep role as text for flexibility.

-- 1. Admins
create table if not exists public.lifelink_admins (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  password_hash text not null,
  full_name text not null,
  role text not null,
  is_super_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lifelink_admins_email_idx on public.lifelink_admins (email);
create index if not exists lifelink_admins_role_idx on public.lifelink_admins (role);

-- 2. Audit logs
create table if not exists public.lifelink_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid, -- nullable for super_admin (hidden) actions
  admin_email text not null,
  action text not null,           -- e.g. 'admin.create', 'user.update', 'message.delete'
  entity_type text,               -- 'admin' | 'user' | 'content' | 'message' | 'notification'
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists lifelink_audit_logs_created_at_idx on public.lifelink_audit_logs (created_at desc);
create index if not exists lifelink_audit_logs_admin_id_idx on public.lifelink_audit_logs (admin_id);
create index if not exists lifelink_audit_logs_entity_idx on public.lifelink_audit_logs (entity_type, entity_id);

-- 3. Users (canonical registered users across all sectors)
create table if not exists public.lifelink_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext not null,
  phone text not null,
  address text not null,
  occupation text,
  next_of_kin_name text,
  next_of_kin_phone text,
  service_key text not null,
  notes text not null default '',
  status text not null default 'new',
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lifelink_users_email_idx on public.lifelink_users (email);
create index if not exists lifelink_users_service_key_idx on public.lifelink_users (service_key);
create index if not exists lifelink_users_status_idx on public.lifelink_users (status);
create index if not exists lifelink_users_created_at_idx on public.lifelink_users (created_at desc);

-- 4. Messages (internal admin messaging)
create table if not exists public.lifelink_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.lifelink_admins(id) on delete cascade,
  body text not null,
  reply_to uuid references public.lifelink_messages(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lifelink_messages_sender_id_idx on public.lifelink_messages (sender_id);
create index if not exists lifelink_messages_reply_to_idx on public.lifelink_messages (reply_to);
create index if not exists lifelink_messages_created_at_idx on public.lifelink_messages (created_at desc);

create table if not exists public.lifelink_message_recipients (
  message_id uuid not null references public.lifelink_messages(id) on delete cascade,
  admin_id uuid not null references public.lifelink_admins(id) on delete cascade,
  primary key (message_id, admin_id)
);

create index if not exists lifelink_message_recipients_admin_id_idx on public.lifelink_message_recipients (admin_id);

create table if not exists public.lifelink_message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.lifelink_messages(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text,
  file_size integer,
  created_at timestamptz not null default now()
);

create index if not exists lifelink_message_attachments_message_id_idx on public.lifelink_message_attachments (message_id);

-- 5. Notifications
create table if not exists public.lifelink_notifications (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.lifelink_admins(id) on delete set null,
  subject text not null,
  body text not null,
  recipient_mode text not null default 'all', -- 'all' | 'selected'
  created_at timestamptz not null default now()
);

create index if not exists lifelink_notifications_created_at_idx on public.lifelink_notifications (created_at desc);

create table if not exists public.lifelink_notification_recipients (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.lifelink_notifications(id) on delete cascade,
  user_id uuid not null references public.lifelink_users(id) on delete cascade,
  status text not null default 'queued', -- 'queued' | 'sent' | 'failed'
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists lifelink_notification_recipients_notification_id_idx on public.lifelink_notification_recipients (notification_id);
create index if not exists lifelink_notification_recipients_user_id_idx on public.lifelink_notification_recipients (user_id);

-- 6. Content (editable site content)
create table if not exists public.lifelink_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  updated_by uuid references public.lifelink_admins(id) on delete set null,
  updated_at timestamptz not null default now()
);

create index if not exists lifelink_content_key_idx on public.lifelink_content (key);

-- 7. Seed super admin
-- Password: 111111Ss  (bcrypt hash precomputed with 12 rounds)
-- The hash below was generated with bcryptjs at 12 rounds.
insert into public.lifelink_admins (email, password_hash, full_name, role, is_super_admin)
values (
  'onyevid@gmail.com',
  '$2b$12$rnkf7Xf.h/MxTx3j27zWMuBkvYiY6BOlIzm5T36f9TksNijQv4Vu.',
  'Developer',
  'super_admin',
  true
)
on conflict (email) do nothing;
