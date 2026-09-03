-- Seed all 14 LifeLink sectors into the lifelink_sectors table.
-- Uses ON CONFLICT to update existing rows if the key already exists.

-- 1. Cooperative Society
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'cooperative',
  'Cooperative Society',
  'Member-owned financial cooperation',
  'A member-owned cooperative promoting thrift, credit, and mutual financial support for sustainable economic growth.',
  'Users',
  '#0d9488', '#0f766e',
  'Together we save, together we grow',
  '[{"description":"Our Cooperative Society is the foundation of LifeLink — a member-owned financial cooperative promoting thrift, credit, and mutual support."},{"description":"Through cooperative principles, we empower members to pool resources, access credit, and build sustainable economic growth together."}]'::jsonb,
  '[{"title":"Thrift & Savings","description":"Structured savings plans that help members build financial discipline and security."},{"title":"Credit Facilities","description":"Accessible loans and credit for members at fair rates and flexible terms."},{"title":"Member Welfare","description":"Programs designed to support members'' well-being and financial stability."}]'::jsonb,
  '["Access to member credit and loans","Structured savings plans","Mutual financial support","Democratic member governance"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 2. Humanitarian Services
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'humanitarian',
  'Humanitarian Services',
  'Youth empowerment & community development',
  'Supporting youth empowerment and community development through impactful social intervention programs.',
  'HandHeart',
  '#f43f5e', '#ec4899',
  'Empowering lives, transforming communities',
  '[{"description":"Our Humanitarian sector drives impactful social intervention programs that uplift individuals and strengthen communities across Nigeria."},{"description":"Through youth empowerment, grassroots projects, and community development initiatives, we create lasting change where it matters most — at the root."}]'::jsonb,
  '[{"title":"Youth Empowerment Programs","description":"Skill acquisition, mentorship, and leadership training designed to equip young people with tools for sustainable livelihoods."},{"title":"Community Development","description":"Grassroots projects that improve infrastructure, health, and education in underserved localities."},{"title":"Social Intervention","description":"Targeted relief and support programs for vulnerable families and individuals during critical times."},{"title":"Medical Outreach","description":"Free medical missions, health screenings, and healthcare support for underserved communities."},{"title":"Skill Acquisition","description":"Hands-on vocational and technical training programs that equip members with practical, income-generating skills."}]'::jsonb,
  '["Access to free training and mentorship","Medical outreach and health support","Vocational skill acquisition programs","Community project participation","Humanitarian support initiatives","Leadership development pathways"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 3. Finance
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'finance',
  'Finance',
  'Innovative financial solutions',
  'Providing innovative financial solutions that promote economic growth.',
  'Wallet',
  '#10b981', '#059669',
  'Innovative financial solutions for real growth',
  '[{"description":"Our Finance sector delivers innovative financial products and services that promote economic growth and financial inclusion for members."},{"description":"From savings cooperatives to credit facilities, we build pathways that help individuals and families achieve financial stability."}]'::jsonb,
  '[{"title":"Savings & Credit Cooperative","description":"Structured savings plans and accessible credit facilities designed for members'' everyday financial needs."},{"title":"Financial Literacy","description":"Training programs that build money-management skills and empower informed financial decisions."},{"title":"Member-First Products","description":"Financial products built around member welfare — low rates, flexible terms, and transparent processes."},{"title":"Project Financing","description":"Dedicated financing for viable projects — providing the capital and structured funding members need to execute and scale."}]'::jsonb,
  '["Access to member loans and credit","Project financing for viable initiatives","Structured savings plans","Financial education and mentorship","Transparent, accountable governance"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 4. Trading
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'trading',
  'Trading',
  'Local & international trade',
  'Engaging in local and international trade across diverse industries.',
  'TrendingUp',
  '#3b82f6', '#2563eb',
  'Local reach, global opportunities',
  '[{"description":"Our Trading sector engages in local and international trade across diverse industries — connecting markets, suppliers, and buyers within and beyond Nigeria."},{"description":"We create trade opportunities that empower members to grow businesses and access wider markets."}]'::jsonb,
  '[{"title":"Local & International Trade","description":"Facilitating commerce across borders and industries, opening new revenue channels for members."},{"title":"Market Access","description":"Connecting members to verified buyers, suppliers, and distribution networks."},{"title":"Trade Advisory","description":"Expert guidance on import/export, compliance, and trade documentation."}]'::jsonb,
  '["Access to trade networks","Business growth opportunities","Expert trade advisory","Cross-border commerce support"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 5. Affiliate Marketing
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'affiliate',
  'Affiliate Marketing',
  'Performance-based income',
  'Creating legitimate income opportunities through performance-based marketing.',
  'Share2',
  '#f97316', '#ea580c',
  'Earn through performance, grow through partnership',
  '[{"description":"Our Affiliate Marketing sector creates legitimate income opportunities through performance-based marketing campaigns and partnerships."},{"description":"Members earn commissions by promoting verified products and services — a flexible, scalable income stream."}]'::jsonb,
  '[{"title":"Performance-Based Earnings","description":"Earn commissions tied directly to results — transparent, fair, and scalable."},{"title":"Verified Partnerships","description":"Work only with vetted brands and products that meet our quality standards."},{"title":"Training & Tools","description":"Access marketing materials, training, and mentorship to grow your affiliate business."}]'::jsonb,
  '["Flexible earning opportunities","Legitimate, transparent income","Marketing training and support","Access to vetted brand partnerships"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 6. Multilevel Marketing
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'mlm',
  'Multilevel Marketing',
  'Structured networking',
  'Offering structured networking opportunities for both corporate and individual business growth.',
  'Network',
  '#a855f7', '#9333ea',
  'Grow together through structured networking',
  '[{"description":"Our Multilevel Marketing sector offers structured networking opportunities for both corporate and individual business growth."},{"description":"Members build teams, unlock commissions, and develop leadership skills within a transparent, ethical framework."}]'::jsonb,
  '[{"title":"Structured Networking","description":"A clear, ethical MLM framework that rewards team building and performance."},{"title":"Team Leadership","description":"Develop leadership skills as you grow and mentor your downline."},{"title":"Corporate & Individual Tracks","description":"Pathways designed for both solo entrepreneurs and corporate partners."}]'::jsonb,
  '["Team-based earnings","Leadership development","Corporate and individual tracks","Transparent compensation structure"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 7. Oil and Gas
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'oilgas',
  'Oil and Gas',
  'Energy sector partnership',
  'Participating through partnership and investment in Nigeria''s energy sector.',
  'Fuel',
  '#0ea5e9', '#1e40af',
  'Powering Nigeria''s energy future',
  '[{"description":"Our Oil and Gas sector participates through partnership and investment in Nigeria''s energy sector — one of the most strategic industries on the continent."},{"description":"We create member access to opportunities within oil, gas, and downstream energy services."}]'::jsonb,
  '[{"title":"Energy Sector Partnerships","description":"Strategic partnerships with established players in Nigeria''s energy value chain."},{"title":"Investment Access","description":"Member-exclusive investment opportunities in oil and gas projects."},{"title":"Downstream Services","description":"Participation in downstream services — distribution, logistics, and retail."}]'::jsonb,
  '["Access to energy-sector investments","Strategic industry partnerships","Downstream business opportunities","Long-term sector exposure"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 8. Land Banking
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'landbanking',
  'Land Banking',
  'Choice landed properties',
  'Assisting individuals and investors to acquire choice landed properties for use, business, and future returns.',
  'LandPlot',
  '#84cc16', '#65a30d',
  'Own land, build wealth, secure your future',
  '[{"description":"Our Land Banking sector assists individuals and investors to acquire choice landed properties for use, business, and future returns."},{"description":"With verified titles and flexible payment plans, we make land ownership accessible and secure."}]'::jsonb,
  '[{"title":"Choice Properties","description":"Carefully selected land in high-potential locations across Nigeria."},{"title":"Flexible Payment Plans","description":"Structured payment options that make land ownership realistic for every budget."},{"title":"Verified Titles","description":"All properties come with verified documentation and transparent ownership records."}]'::jsonb,
  '["Secure, verified land ownership","Flexible payment plans","Long-term asset appreciation","Investor support and advisory"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 9. Food Bank
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'foodbank',
  'Food Bank',
  'Food security & subsidization',
  'Promoting food security through food banking, subsidization programs, and agro-distribution networks.',
  'Wheat',
  '#84cc16', '#22c55e',
  'Feeding communities, securing futures',
  '[{"description":"Our Food Bank sector promotes food security through food banking, subsidization programs, and agro-distribution networks."},{"description":"We work to ensure that vulnerable families have access to affordable, nutritious food while creating opportunities for members in food distribution."}]'::jsonb,
  '[{"title":"Food Banking","description":"Collecting, storing, and distributing food to vulnerable families and communities."},{"title":"Subsidization Programs","description":"Making essential food items affordable through strategic subsidies and partnerships."},{"title":"Distribution Networks","description":"Efficient logistics and distribution channels that reach those who need it most."},{"title":"Fractional Farming","description":"Members can participate in farming activities through fractional ownership — investing in and benefiting from agricultural output without owning large farmlands."}]'::jsonb,
  '["Food security support","Fractional farming participation","Subsidized food access","Distribution opportunities","Community impact participation"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 10. Transportation
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'transport',
  'Transportation',
  'Reliable transport services',
  'Delivering reliable transport services with structured, viable payment systems.',
  'Bus',
  '#06b6d4', '#0891b2',
  'Reliable mobility, structured payments',
  '[{"description":"Our Transportation sector delivers reliable transport services with structured, viable payment systems — including hire purchase, daily pay, and outright purchase options."},{"description":"We make vehicle ownership and transport services accessible to members."}]'::jsonb,
  '[{"title":"Hire Purchase","description":"Own vehicles through structured hire-purchase agreements with transparent terms."},{"title":"Daily Pay System","description":"Flexible daily payment plans designed for drivers and transport operators."},{"title":"Outright Purchase","description":"Buy vehicles outright with member-exclusive pricing and support."}]'::jsonb,
  '["Flexible vehicle ownership","Daily pay options","Reliable transport services","Member-exclusive pricing"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 11. Digital Assets
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'digital',
  'Digital Assets',
  'Digital asset advisory',
  'Providing blockchain education, digital asset advisory, and tokenization solutions.',
  'Blocks',
  '#8b5cf6', '#6366f1',
  'Blockchain education, digital asset advisory',
  '[{"description":"Our Digital Assets sector provides blockchain education, digital asset advisory, and tokenization solutions — preparing members for the digital economy."},{"description":"We demystify Web3 and help members navigate the emerging world of digital assets with confidence."}]'::jsonb,
  '[{"title":"Blockchain Education","description":"Training programs that break down blockchain technology, use cases, and opportunities."},{"title":"Digital Asset Advisory","description":"Expert guidance on navigating digital assets — from crypto to tokenized real-world assets."},{"title":"Tokenization Solutions","description":"Helping businesses and members tokenize assets for liquidity, access, and growth."}]'::jsonb,
  '["Blockchain training and certification","Digital asset advisory","Tokenization opportunities","Access to the Web3 economy"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 12. Information Technology
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'it',
  'Information Technology',
  'Innovative tech solutions',
  'Delivering cutting-edge information technology solutions for digital transformation and innovation.',
  'Monitor',
  '#6366f1', '#4f46e5',
  'Driving digital transformation',
  '[{"description":"Our Information Technology sector delivers cutting-edge tech solutions for digital transformation and innovation."},{"description":"We build and deploy technology that empowers members, streamlines operations, and creates new opportunities in the digital economy."}]'::jsonb,
  '[{"title":"Digital Transformation","description":"Helping businesses and members adopt modern technology for growth and efficiency."},{"title":"Tech Innovation","description":"Developing innovative solutions tailored to our members'' and communities'' needs."},{"title":"IT Solutions","description":"End-to-end information technology services — from consulting to deployment and support."}]'::jsonb,
  '["Access to modern tech tools","Digital skills training","Innovation opportunities","Tech-driven business support"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 13. Investment and Loans
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'investment',
  'Investment and Loans',
  'Capital & financial aid',
  'Providing investment opportunities and empowering the community with start-up capital and financial aid.',
  'PiggyBank',
  '#eab308', '#ca8a04',
  'Capital, credit, and community empowerment',
  '[{"description":"Our Investment and Loans sector provides investment opportunities and empowers the community with start-up capital and financial aid."},{"description":"We bridge the gap between ambition and resources — helping members launch, grow, and sustain businesses."}]'::jsonb,
  '[{"title":"Start-Up Capital","description":"Financial support for entrepreneurs ready to launch or scale their businesses."},{"title":"Investment Opportunities","description":"Curated investment options across LifeLink sectors — transparent and member-focused."},{"title":"Loan Facilities","description":"Qualified members access loans subject to cooperative policies and repayment capacity."}]'::jsonb,
  '["Access to start-up capital","Curated investment options","Member loan facilities","Business development support"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();

-- 14. Solar Energy
INSERT INTO public.lifelink_sectors (key, title, subtitle, description, icon, color_from, color_to, tagline, overview, features, benefits, is_active, accepting_registrations)
VALUES (
  'solar',
  'Solar Energy',
  'Renewable energy solutions',
  'Promoting sustainable energy through solar power installation, distribution, and renewable energy solutions.',
  'Sun',
  '#f59e0b', '#d97706',
  'Powering a sustainable tomorrow',
  '[{"description":"Our Solar Energy sector promotes sustainable energy through solar power installation, distribution, and renewable energy solutions."},{"description":"We make clean energy accessible and affordable for homes, businesses, and communities."}]'::jsonb,
  '[{"title":"Solar Installation","description":"Professional installation of solar panels and systems for residential and commercial use."},{"title":"Renewable Energy Distribution","description":"Distribution of solar components, batteries, and renewable energy products."},{"title":"Sustainable Power Solutions","description":"Custom-designed solar solutions for off-grid communities and energy-independent living."}]'::jsonb,
  '["Clean, renewable energy access","Reduced electricity costs","Solar product distribution opportunities","Off-grid power solutions"]'::jsonb,
  true, true
)
ON CONFLICT (key) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  icon = EXCLUDED.icon, color_from = EXCLUDED.color_from, color_to = EXCLUDED.color_to,
  tagline = EXCLUDED.tagline, overview = EXCLUDED.overview, features = EXCLUDED.features,
  benefits = EXCLUDED.benefits, updated_at = now();
