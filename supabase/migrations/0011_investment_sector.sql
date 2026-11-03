-- 0011: LifeLink Investment and Savings — full sector upgrade
-- Adds investment_data JSONB column to lifelink_users and updates the sector seed.

-- 1. Add investment_data column to store Part B + C fields from the physical form
ALTER TABLE public.lifelink_users
  ADD COLUMN IF NOT EXISTS investment_data jsonb DEFAULT NULL;

-- 2. Update the 'investment' sector row with rich content from the promotional graphics
UPDATE public.lifelink_sectors
SET
  title = 'LifeLink Investment and Savings',
  subtitle = 'Let Your Money Work For You',
  description = 'Invest with LifeLink and earn 36% per annum (3% monthly flat rate). Choose from 6 investment tiers starting at ₦50,000. Pilot and first-phase investors are regarded as Pioneers and automatically receive LifeLink Group shares.',
  icon = 'TrendingUp',
  color_from = '#1e40af',
  color_to = '#0ea5e9',
  tagline = 'Let Your Money Work For You',
  overview = '[
    {"description":"LifeLink Investment and Savings is our flagship investment platform offering 36% per annum interest rate — payable and retainable. Whether you are starting your investment journey or deploying substantial capital, we have a tier designed for you."},
    {"description":"Pilot and first-phase investors will be regarded as PIONEERS and will automatically receive LIFELINK GROUP SHARES. Our 6-tier structure ensures every level of investor gets fair, transparent returns paid monthly at a 3% flat rate calculated on your original investment."},
    {"description":"Choose your investment duration: 90 days, 120 days, 180 days, or 365 days. All tiers are eligible for monthly payout from ₦50,000 to Premium."}
  ]'::jsonb,
  features = '[
    {"title":"Starter Pioneer (₦50,000 – ₦249,999)","description":"Entry-level investment designed for members and individuals beginning their investment journey with LifeLink. Earn ₦1,500 – ₦7,500 monthly at 3%."},
    {"title":"Growth Pioneer (₦250,000 – ₦499,999)","description":"Growth-level investment for investors who want to make a larger contribution to LifeLink''s growth. Earn ₦7,500 – ₦15,000 monthly at 3%."},
    {"title":"Builder Pioneer (₦500,000 – ₦999,999)","description":"Builder-level investment for investors supporting the development and expansion of LifeLink''s business activities. Earn ₦15,000 – ₦30,000 monthly at 3%."},
    {"title":"Gold Pioneer (₦1,000,000 – ₦2,499,999)","description":"Major contributor tier for investors contributing substantial capital towards approved projects and business expansion. Earn ₦30,000 – ₦75,000 monthly at 3%."},
    {"title":"Strategic Pioneer (₦2,500,000 – ₦4,999,999)","description":"Strategic investment for investors whose capital can support larger-scale projects and strategic business development. Earn ₦75,000 – ₦150,000 monthly at 3%."},
    {"title":"Premium Pioneer (₦5,000,000 and above)","description":"Premium investment for high-value investors who may qualify for additional recognition and engagement opportunities under approved LifeLink programs. Earn ₦150,000+ monthly at 3%."}
  ]'::jsonb,
  benefits = '[
    "36% per annum interest rate — payable and retainable",
    "3% monthly flat rate payout on your original investment",
    "Flexible durations: 90, 120, 180, or 365 days",
    "Pioneer recognition with LifeLink Group shares",
    "Simple and clear — calculated on original investment only",
    "All tiers eligible — from ₦50,000 to Premium",
    "Secure bank transfer or teller payment methods",
    "ROI and capital paid directly to your bank account"
  ]'::jsonb,
  updated_at = now()
WHERE key = 'investment';
