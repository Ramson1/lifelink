import type { ServiceKey } from "@/lib/brand";

export interface SectorDetail {
  key: ServiceKey;
  tagline: string;
  overview: string[];
  features: { title: string; description: string }[];
  benefits: string[];
  cta: {
    heading: string;
    description: string;
  };
}

export const sectors: SectorDetail[] = [
  {
    key: "humanitarian",
    tagline: "Empowering lives, transforming communities",
    overview: [
      "Our Humanitarian sector drives impactful social intervention programs that uplift individuals and strengthen communities across Nigeria.",
      "Through youth empowerment, grassroots projects, and community development initiatives, we create lasting change where it matters most — at the root.",
    ],
    features: [
      {
        title: "Youth Empowerment Programs",
        description:
          "Skill acquisition, mentorship, and leadership training designed to equip young people with tools for sustainable livelihoods.",
      },
      {
        title: "Community Development",
        description:
          "Grassroots projects that improve infrastructure, health, and education in underserved localities.",
      },
      {
        title: "Social Intervention",
        description:
          "Targeted relief and support programs for vulnerable families and individuals during critical times.",
      },
    ],
    benefits: [
      "Access to free training and mentorship",
      "Community project participation",
      "Humanitarian support initiatives",
      "Leadership development pathways",
    ],
    cta: {
      heading: "Join the humanitarian movement",
      description:
        "Become part of a community that transforms lives every day. Register now and start making impact.",
    },
  },
  {
    key: "finance",
    tagline: "Innovative financial solutions for real growth",
    overview: [
      "Our Finance sector delivers innovative financial products and services that promote economic growth and financial inclusion for members.",
      "From savings cooperatives to credit facilities, we build pathways that help individuals and families achieve financial stability.",
    ],
    features: [
      {
        title: "Savings & Credit Cooperative",
        description:
          "Structured savings plans and accessible credit facilities designed for members' everyday financial needs.",
      },
      {
        title: "Financial Literacy",
        description:
          "Training programs that build money-management skills and empower informed financial decisions.",
      },
      {
        title: "Member-First Products",
        description:
          "Financial products built around member welfare — low rates, flexible terms, and transparent processes.",
      },
    ],
    benefits: [
      "Access to member loans and credit",
      "Structured savings plans",
      "Financial education and mentorship",
      "Transparent, accountable governance",
    ],
    cta: {
      heading: "Take control of your financial future",
      description:
        "Join a finance ecosystem built for members. Register today and unlock cooperative financial benefits.",
    },
  },
  {
    key: "trading",
    tagline: "Local reach, global opportunities",
    overview: [
      "Our Trading sector engages in local and international trade across diverse industries — connecting markets, suppliers, and buyers within and beyond Nigeria.",
      "We create trade opportunities that empower members to grow businesses and access wider markets.",
    ],
    features: [
      {
        title: "Local & International Trade",
        description:
          "Facilitating commerce across borders and industries, opening new revenue channels for members.",
      },
      {
        title: "Market Access",
        description:
          "Connecting members to verified buyers, suppliers, and distribution networks.",
      },
      {
        title: "Trade Advisory",
        description:
          "Expert guidance on import/export, compliance, and trade documentation.",
      },
    ],
    benefits: [
      "Access to trade networks",
      "Business growth opportunities",
      "Expert trade advisory",
      "Cross-border commerce support",
    ],
    cta: {
      heading: "Expand your trade horizons",
      description:
        "Tap into local and international markets with LifeLink. Register to start trading.",
    },
  },
  {
    key: "affiliate",
    tagline: "Earn through performance, grow through partnership",
    overview: [
      "Our Affiliate Marketing sector creates legitimate income opportunities through performance-based marketing campaigns and partnerships.",
      "Members earn commissions by promoting verified products and services — a flexible, scalable income stream.",
    ],
    features: [
      {
        title: "Performance-Based Earnings",
        description:
          "Earn commissions tied directly to results — transparent, fair, and scalable.",
      },
      {
        title: "Verified Partnerships",
        description:
          "Work only with vetted brands and products that meet our quality standards.",
      },
      {
        title: "Training & Tools",
        description:
          "Access marketing materials, training, and mentorship to grow your affiliate business.",
      },
    ],
    benefits: [
      "Flexible earning opportunities",
      "Legitimate, transparent income",
      "Marketing training and support",
      "Access to vetted brand partnerships",
    ],
    cta: {
      heading: "Start earning through affiliate marketing",
      description:
        "Build a legitimate income stream with LifeLink. Register and start promoting today.",
    },
  },
  {
    key: "mlm",
    tagline: "Grow together through structured networking",
    overview: [
      "Our Multi-Level Marketing sector offers structured networking opportunities for both corporate and individual business growth.",
      "Members build teams, unlock commissions, and develop leadership skills within a transparent, ethical framework.",
    ],
    features: [
      {
        title: "Structured Networking",
        description:
          "A clear, ethical MLM framework that rewards team building and performance.",
      },
      {
        title: "Team Leadership",
        description:
          "Develop leadership skills as you grow and mentor your downline.",
      },
      {
        title: "Corporate & Individual Tracks",
        description:
          "Pathways designed for both solo entrepreneurs and corporate partners.",
      },
    ],
    benefits: [
      "Team-based earnings",
      "Leadership development",
      "Corporate and individual tracks",
      "Transparent compensation structure",
    ],
    cta: {
      heading: "Build your network, build your future",
      description:
        "Join a structured MLM program designed for real growth. Register to get started.",
    },
  },
  {
    key: "production",
    tagline: "Quality goods, reliable services",
    overview: [
      "Our Production sector manufactures diverse quality goods and delivers services that meet target-market demands.",
      "From consumer products to industrial supplies, we produce with integrity, quality, and efficiency.",
    ],
    features: [
      {
        title: "Quality Manufacturing",
        description:
          "Standards-driven production processes that deliver consistent, reliable products.",
      },
      {
        title: "Diverse Product Lines",
        description:
          "A wide range of goods across categories — built to meet real market needs.",
      },
      {
        title: "Member Opportunities",
        description:
          "Members can participate in production, distribution, and retail channels.",
      },
    ],
    benefits: [
      "Access to quality products",
      "Distribution and retail opportunities",
      "Market-driven production",
      "Member participation pathways",
    ],
    cta: {
      heading: "Be part of the production ecosystem",
      description:
        "Join a sector that produces real value. Register to explore opportunities.",
    },
  },
  {
    key: "investment",
    tagline: "Capital, credit, and community empowerment",
    overview: [
      "Our Investment & Loans sector provides investment opportunities and empowers the community with start-up capital and financial aid.",
      "We bridge the gap between ambition and resources — helping members launch, grow, and sustain businesses.",
    ],
    features: [
      {
        title: "Start-Up Capital",
        description:
          "Financial support for entrepreneurs ready to launch or scale their businesses.",
      },
      {
        title: "Investment Opportunities",
        description:
          "Curated investment options across LifeLink sectors — transparent and member-focused.",
      },
      {
        title: "Loan Facilities",
        description:
          "Qualified members access loans subject to cooperative policies and repayment capacity.",
      },
    ],
    benefits: [
      "Access to start-up capital",
      "Curated investment options",
      "Member loan facilities",
      "Business development support",
    ],
    cta: {
      heading: "Unlock capital for your goals",
      description:
        "Access investment and loan opportunities built for members. Register to apply.",
    },
  },
  {
    key: "landbanking",
    tagline: "Own land, build wealth, secure your future",
    overview: [
      "Our Land Banking sector assists individuals and investors to acquire choice landed properties for use and future returns.",
      "With verified titles and flexible payment plans, we make land ownership accessible and secure.",
    ],
    features: [
      {
        title: "Choice Properties",
        description:
          "Carefully selected land in high-potential locations across Nigeria.",
      },
      {
        title: "Flexible Payment Plans",
        description:
          "Structured payment options that make land ownership realistic for every budget.",
      },
      {
        title: "Verified Titles",
        description:
          "All properties come with verified documentation and transparent ownership records.",
      },
    ],
    benefits: [
      "Secure, verified land ownership",
      "Flexible payment plans",
      "Long-term asset appreciation",
      "Investor support and advisory",
    ],
    cta: {
      heading: "Secure your piece of land",
      description:
        "Start your land ownership journey with LifeLink. Register to explore available properties.",
    },
  },
  {
    key: "transport",
    tagline: "Reliable mobility, structured payments",
    overview: [
      "Our Transportation sector delivers reliable transport services with structured, viable payment systems — including hire purchase, daily pay, and outright purchase options.",
      "We make vehicle ownership and transport services accessible to members.",
    ],
    features: [
      {
        title: "Hire Purchase",
        description:
          "Own vehicles through structured hire-purchase agreements with transparent terms.",
      },
      {
        title: "Daily Pay System",
        description:
          "Flexible daily payment plans designed for drivers and transport operators.",
      },
      {
        title: "Outright Purchase",
        description:
          "Buy vehicles outright with member-exclusive pricing and support.",
      },
    ],
    benefits: [
      "Flexible vehicle ownership",
      "Daily pay options",
      "Reliable transport services",
      "Member-exclusive pricing",
    ],
    cta: {
      heading: "Drive your future with LifeLink",
      description:
        "Access structured vehicle ownership plans. Register to learn more.",
    },
  },
  {
    key: "agriculture",
    tagline: "Food security through modern agribusiness",
    overview: [
      "Our Agriculture sector promotes food security through modern agribusinesses and agro-investment — from farm to table.",
      "We empower members to participate in a sector that feeds nations and builds generational wealth.",
    ],
    features: [
      {
        title: "Modern Agribusiness",
        description:
          "Adopting modern farming techniques, technology, and best practices for higher yields.",
      },
      {
        title: "Agro-Investment",
        description:
          "Investment opportunities in agriculture — from crop production to processing and distribution.",
      },
      {
        title: "Food Bank Initiative",
        description:
          "Supporting vulnerable families through subsidized food supplies and food support programs.",
      },
    ],
    benefits: [
      "Agro-investment opportunities",
      "Access to modern farming training",
      "Food bank participation",
      "Farm-to-market support",
    ],
    cta: {
      heading: "Grow with LifeLink Agriculture",
      description:
        "Join a sector that feeds communities and builds wealth. Register to explore opportunities.",
    },
  },
  {
    key: "oilgas",
    tagline: "Powering Nigeria's energy future",
    overview: [
      "Our Oil & Gas sector participates through partnership and investment in Nigeria's energy sector — one of the most strategic industries on the continent.",
      "We create member access to opportunities within oil, gas, and downstream energy services.",
    ],
    features: [
      {
        title: "Energy Sector Partnerships",
        description:
          "Strategic partnerships with established players in Nigeria's energy value chain.",
      },
      {
        title: "Investment Access",
        description:
          "Member-exclusive investment opportunities in oil and gas projects.",
      },
      {
        title: "Downstream Services",
        description:
          "Participation in downstream services — distribution, logistics, and retail.",
      },
    ],
    benefits: [
      "Access to energy-sector investments",
      "Strategic industry partnerships",
      "Downstream business opportunities",
      "Long-term sector exposure",
    ],
    cta: {
      heading: "Tap into the energy sector",
      description:
        "Join LifeLink's Oil & Gas sector and access strategic energy opportunities. Register today.",
    },
  },
  {
    key: "digital",
    tagline: "Blockchain education, digital asset advisory",
    overview: [
      "Our Blockchain & Digital Assets sector provides blockchain education, digital asset advisory, and tokenization solutions — preparing members for the digital economy.",
      "We demystify Web3 and help members navigate the emerging world of digital assets with confidence.",
    ],
    features: [
      {
        title: "Blockchain Education",
        description:
          "Training programs that break down blockchain technology, use cases, and opportunities.",
      },
      {
        title: "Digital Asset Advisory",
        description:
          "Expert guidance on navigating digital assets — from crypto to tokenized real-world assets.",
      },
      {
        title: "Tokenization Solutions",
        description:
          "Helping businesses and members tokenize assets for liquidity, access, and growth.",
      },
    ],
    benefits: [
      "Blockchain training and certification",
      "Digital asset advisory",
      "Tokenization opportunities",
      "Access to the Web3 economy",
    ],
    cta: {
      heading: "Step into the digital economy",
      description:
        "Explore blockchain and digital assets with LifeLink. Register to start your journey.",
    },
  },
];

export function getSector(key: string): SectorDetail | undefined {
  return sectors.find((s) => s.key === key);
}
