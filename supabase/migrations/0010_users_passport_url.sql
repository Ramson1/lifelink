-- 0010: Ensure lifelink_users has a passport_url column.
-- The website registration API (/api/registration) inserts into this column
-- and the admin Users view reads it, but no earlier migration added it.
-- If your Supabase project already has the column (added manually or via
-- an out-of-band change), `if not exists` makes this a safe no-op.
--
-- Also used as the storage target once passport photos migrate to Cloudinary:
-- the value stored is an absolute https://res.cloudinary.com/... URL returned
-- by /api/registration/upload (see src/lib/storage/cloudinary.ts).
alter table public.lifelink_users
  add column if not exists passport_url text not null default '';
