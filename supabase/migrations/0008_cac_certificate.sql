-- =============================================================================
-- LifeLink Group — CAC Certificate of Incorporation
-- Migration: 0008_cac_certificate.sql
--
-- Adds the official CAC Certificate of Incorporation (Company Registration
-- No. 9508709) to the Certificates section shown on /events.
--
-- The image is served from the site's public folder:
--   /certificates/cac-certificate-of-incorporation.jpg
-- (commit this file from the repo to your deployment as usual).
--
-- Safe to run multiple times: it only inserts when no certificate with the
-- same image URL exists yet.
-- =============================================================================

insert into lifelink_certificates (title, subtitle, image_url, icon_emoji, sort_order, is_active)
select
  'CAC Certificate of Incorporation',
  'Company Registration No. 9508709 — Federal Republic of Nigeria',
  '/certificates/cac-certificate-of-incorporation.jpg',
  '🏛️',
  1,
  true
where not exists (
  select 1 from lifelink_certificates
  where image_url = '/certificates/cac-certificate-of-incorporation.jpg'
);
