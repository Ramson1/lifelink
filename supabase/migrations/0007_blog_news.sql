-- ============================================================================
-- LifeLink Group — Blog & News
-- Paste this whole file into the Supabase SQL editor and run it.
-- Creates the `lifelink_posts` table (shared by blog + news via `kind`),
-- indexes, a unique slug constraint, RLS, and first seed content.
-- ============================================================================

create table if not exists public.lifelink_posts (
  id               uuid primary key default gen_random_uuid(),
  kind             text not null default 'blog' constraint lifelink_posts_kind_check check (kind in ('blog', 'news')),
  title            text not null,
  slug             text not null,
  excerpt          text not null default '',
  content          text not null default '',
  cover_image_url  text,
  author           text not null default 'LifeLink Group Editorial Team',
  category         text not null default '',
  tags             text not null default '',
  featured         boolean not null default false,
  is_published     boolean not null default true,
  published_at     timestamptz,
  meta_title       text,
  meta_description text,
  sort_order       int  not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- One published post per slug (slug is the public URL identifier).
create unique index if not exists lifelink_posts_slug_key on public.lifelink_posts (slug);
create index if not exists lifelink_posts_kind_idx        on public.lifelink_posts (kind);
create index if not exists lifelink_posts_published_idx   on public.lifelink_posts (is_published, published_at desc);
create index if not exists lifelink_posts_featured_idx    on public.lifelink_posts (featured);

-- Keep updated_at fresh on writes.
create or replace function lifelink_posts_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists lifelink_posts_touch_updated on public.lifelink_posts;
create trigger lifelink_posts_touch_updated
  before update on public.lifelink_posts
  for each row execute function lifelink_posts_touch_updated_at();

-- Enable RLS. All app reads/writes go through the service-role key (admin API),
-- which bypasses RLS — mirroring every other lifelink_* table.
alter table public.lifelink_posts enable row level security;

-- ============================================================================
-- Seed content — first blog posts and news articles
-- ============================================================================

insert into public.lifelink_posts
  (kind, title, slug, excerpt, content, author, category, tags, featured, published_at, sort_order)
values
  (
    'blog',
    'Building Wealth From the Ground Up: How Cooperative Savings Change Lives',
    'building-wealth-through-cooperative-savings',
    'Discover how pooled savings, accountability and community trust turn ordinary earners into confident investors through the LifeLink cooperative model.',
    'For millions of Nigerians, the hardest part of building wealth is not a lack of income — it is the absence of a disciplined, trustworthy structure to grow it. That is exactly the gap our cooperative development arm was created to close.

A cooperative brings people together around a simple idea: when members save consistently and lend responsibly to one another, the group becomes far more financially resilient than any individual could be alone. It is empowerment that compounds.

What makes the LifeLink approach different is accountability. Every contribution is tracked, every disbursement is transparent, and every member can see how their money is working. Trust is not assumed — it is earned through systems, records and open communication.

Financial literacy is the other pillar. We pair savings with education on budgeting, emergency funds, and long-term planning, so that members do not just participate — they understand, and they stay.

If you have ever felt that building wealth was something other people do, this is your invitation to reconsider. Start small, stay consistent, and let the strength of the community carry you further than you could go alone.',
    'LifeLink Group Editorial Team',
    'Cooperative & Savings',
    'cooperative, savings, financial inclusion, empowerment',
    true,
    now() - interval '2 days',
    1
  ),
  (
    'blog',
    'Solar Energy for Nigerian Homes and Businesses: A Practical Starter Guide',
    'solar-energy-practical-starter-guide',
    'From understanding your energy needs to choosing the right system, here is how LifeLink is making clean, reliable power accessible and affordable.',
    'Unreliable power is one of the quiet taxes on Nigerian productivity — lost hours, spoiled goods, roaring generators and rising fuel costs. Solar energy offers a cleaner, calmer alternative, and it is more attainable than most people think.

The first step is honestly assessing your energy needs. Which appliances must run during an outage? How many hours of backup do you actually need? Answering these questions prevents both under-sizing and wasteful over-spending.

The second step is understanding the components: panels capture sunlight, inverters convert stored power for home use, and batteries hold energy for the evening. Matching quality components to your real usage is where durability and value come from.

The third step is choosing a partner you can trust for installation and after-sales support. A solar system is a multi-year investment, and the difference between a good one and a great one is usually the service behind it.

At LifeLink, our solar sector exists to demystify this journey and make the transition to clean, dependable energy a practical decision rather than a luxury. Power that works while you sleep is not a dream — it is a plan.',
    'LifeLink Group Editorial Team',
    'Energy & Solar',
    'solar, energy, sustainability, backup power',
    false,
    now() - interval '9 days',
    2
  ),
  (
    'blog',
    '5 Habits That Turn Ordinary People Into Extraordinary Heroes',
    'habits-that-turn-ordinary-people-into-heroes',
    'Our tagline is a promise, not a slogan. These five everyday habits are how ordinary members grow into the leaders their families and communities need.',
    'Turning ordinary people into extraordinary heroes is the heart of everything LifeLink does. It sounds ambitious — but in practice it comes down to habits anyone can build.

One: save before you spend. Paying yourself first, however small the amount, creates the discipline and the cushion that every bigger goal is built on.

Two: keep learning. The economy rewards those who understand it. A little financial and digital literacy each month compounds into real confidence.

Three: bet on community. The people around you shape your ceiling. Surround yourself with those who are also growing, and hold one another accountable.

Four: plan for the unexpected. Emergency funds, insurance and honest record-keeping are what keep a single setback from becoming a downward spiral.

Five: give back as you rise. Wealth that stays in the family is good; wealth that lifts a community is extraordinary. Every hero we celebrate began exactly where you are now.',
    'LifeLink Group Editorial Team',
    'Empowerment',
    'growth mindset, community, empowerment, discipline',
    false,
    now() - interval '16 days',
    3
  ),
  (
    'news',
    'LifeLink Group Launches Land Banking Program for Families and First-Time Investors',
    'lifelink-launches-land-banking-program',
    'LifeLink Group has introduced a structured land banking program that lets members acquire verified land through flexible, community-backed payment plans.',
    'LifeLink Group International Limited is pleased to announce the launch of its land banking program, designed to make verified, titled land accessible to families, investors and first-time buyers across Nigeria.

The program allows members to acquire land through flexible payment plans backed by the cooperative, removing the single biggest barrier to ownership: the burden of paying a lump sum upfront.

Every parcel in the program is subject to due diligence and documentation checks, so members can invest with confidence that the land they are building a future on is genuinely secure.

Commenting on the launch, our leadership reaffirmed the organization''s 21-year commitment to reducing poverty and creating sustainable opportunities down to the rural communities we serve.

Members can register interest through the LifeLink e-registration portal, where the Land Banking sector is now open for onboarding.',
    'LifeLink Group Communications',
    'Company News',
    'land banking, real estate, investment, announcement',
    true,
    now() - interval '4 days',
    1
  ),
  (
    'news',
    'LifeLink Partners with Local Communities to Expand Humanitarian Food Bank Support',
    'lifelink-expands-humanitarian-food-bank-support',
    'An expanded food bank initiative will reach more households with nutritious support, skills training and emergency relief across Rivers State and beyond.',
    'LifeLink Group has expanded its humanitarian food bank initiative, deepening partnerships with local communities to reach more households with reliable, nutritious support.

The Food Bank is more than relief. Alongside food distribution, the program connects beneficiaries to youth empowerment, skills acquisition and cooperative savings pathways, turning temporary help into lasting stability.

Grassroot projects remain central to our mission, and this expansion reflects our belief that compassion must be matched with structure to create change that outlasts a single donation.

Community leaders involved in the rollout praised the transparent, accountable approach that ensures support reaches those who need it most.

Organizations and individuals who share this vision are welcome to explore partnership and donation opportunities through the LifeLink partners and fundraising pages.',
    'LifeLink Group Communications',
    'Humanitarian',
    'food bank, humanitarian, community, partnership',
    false,
    now() - interval '11 days',
    2
  ),
  (
    'news',
    'LifeLink Digital Assets Sector Opens Registration for Members Nationwide',
    'lifelink-digital-assets-sector-opens-registration',
    'The newly structured Digital Assets sector is now open for registration, giving members guided access to secure, compliant digital investment opportunities.',
    'LifeLink Group announced that its Digital Assets sector is now open for registration, extending the organization''s economic-empowerment mandate into the fast-moving digital economy.

The sector is designed to help members navigate digital investment responsibly, with education, compliance and risk awareness placed before opportunity.

Rather than chasing hype, the approach focuses on building member capability — so that participation in digital markets is informed, measured and sustainable.

Registration is available through the LifeLink e-registration portal, where members can select the Digital Assets sector and begin their onboarding journey.

As with all LifeLink sectors, the priority is the long-term welfare and financial growth of the members we serve.',
    'LifeLink Group Communications',
    'Company News',
    'digital assets, investment, registration, technology',
    false,
    now() - interval '18 days',
    3
  )
on conflict (slug) do nothing;
