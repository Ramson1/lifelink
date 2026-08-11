-- FAQ table for admin-managed frequently asked questions
create table if not exists public.lifelink_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'general',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lifelink_faqs_sort_idx on public.lifelink_faqs (sort_order asc);
create index if not exists lifelink_faqs_published_idx on public.lifelink_faqs (is_published);

-- Seed some default FAQs
insert into public.lifelink_faqs (question, answer, category, sort_order) values
  ('What is LifeLink Group?', 'LifeLink Group International Limited is a CAC-registered Nigerian conglomerate operating across 12 sectors including humanitarian services, finance, trade, agriculture, and digital innovation.', 'general', 1),
  ('How do I register?', 'You can register through our E-Registration page. Select your preferred sector, fill in your details, and submit. Our team will review and contact you with next steps.', 'registration', 2),
  ('Is registration free?', 'Registration is straightforward. Visit our E-Registration page to get started with your preferred sector.', 'registration', 3),
  ('What sectors does LifeLink operate in?', 'LifeLink operates across 12 sectors: Humanitarian, Finance, Trading, Affiliate Marketing, MLM, Production, Investment & Loans, Land Banking, Transportation, Agriculture, Oil & Gas, and Blockchain & Digital Assets.', 'general', 4),
  ('How can I contact LifeLink?', 'You can reach us through our Contact page, by email, or by calling our headquarters. Visit the Contact section for full details.', 'contact', 5);
