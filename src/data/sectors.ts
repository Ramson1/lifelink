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
      {
        title: "Medical Outreach",
        description:
          "Free medical missions, health screenings, and healthcare support for underserved communities.",
      },
      {
        title: "Skill Acquisition",
        description:
          "Hands-on vocational and technical training programs that equip members with practical, income-generating skills.",
      },
    ],
    benefits: [
      "Access to free training and mentorship",
      "Medical outreach and health support",
      "Vocational skill acquisition programs",
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
      {
        title: "Project Financing",
        description:
          "Dedicated financing for viable projects — providing the capital and structured funding members need to execute and scale.",
      },
    ],
    benefits: [
      "Access to member loans and credit",
      "Project financing for viable initiatives",
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
    key: "cooperative",
    tagline: "Together we save, together we grow",
    overview: [
      "Our Cooperative Society is the foundation of LifeLink — a member-owned financial cooperative promoting thrift, credit, and mutual support.",
      "Through cooperative principles, we empower members to pool resources, access credit, and build sustainable economic growth together.",
    ],
    features: [
      {
        title: "Thrift & Savings",
        description:
          "Structured savings plans that help members build financial discipline and security.",
      },
      {
        title: "Credit Facilities",
        description:
          "Accessible loans and credit for members at fair rates and flexible terms.",
      },
      {
        title: "Member Welfare",
        description:
          "Programs designed to support members' well-being and financial stability.",
      },
    ],
    benefits: [
      "Access to member credit and loans",
      "Structured savings plans",
      "Mutual financial support",
      "Democratic member governance",
    ],
    cta: {
      heading: "Join the cooperative movement",
      description:
        "Become a member-owner and unlock cooperative financial benefits. Register today.",
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
      "Our Land Banking sector assists individuals and investors to acquire choice landed properties for use, business, and future returns.",
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
    key: "foodbank",
    tagline: "Feeding communities, securing futures",
    overview: [
      "Our Food Bank sector promotes food security through food banking, subsidization programs, and agro-distribution networks.",
      "We work to ensure that vulnerable families have access to affordable, nutritious food while creating opportunities for members in food distribution.",
    ],
    features: [
      {
        title: "Food Banking",
        description:
          "Collecting, storing, and distributing food to vulnerable families and communities.",
      },
      {
        title: "Subsidization Programs",
        description:
          "Making essential food items affordable through strategic subsidies and partnerships.",
      },
      {
        title: "Distribution Networks",
        description:
          "Efficient logistics and distribution channels that reach those who need it most.",
      },
      {
        title: "Fractional Farming",
        description:
          "Members can participate in farming activities through fractional ownership — investing in and benefiting from agricultural output without owning large farmlands.",
      },
    ],
    benefits: [
      "Food security support",
      "Fractional farming participation",
      "Subsidized food access",
      "Distribution opportunities",
      "Community impact participation",
    ],
    cta: {
      heading: "Help feed the nation",
      description:
        "Join the Food Bank sector and be part of the solution to food insecurity. Register today.",
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
  {
    key: "it",
    tagline: "Driving digital transformation",
    overview: [
      "Our Information Technology sector delivers cutting-edge tech solutions for digital transformation and innovation.",
      "We build and deploy technology that empowers members, streamlines operations, and creates new opportunities in the digital economy.",
    ],
    features: [
      {
        title: "Digital Transformation",
        description:
          "Helping businesses and members adopt modern technology for growth and efficiency.",
      },
      {
        title: "Tech Innovation",
        description:
          "Developing innovative solutions tailored to our members' and communities' needs.",
      },
      {
        title: "IT Solutions",
        description:
          "End-to-end information technology services — from consulting to deployment and support.",
      },
    ],
    benefits: [
      "Access to modern tech tools",
      "Digital skills training",
      "Innovation opportunities",
      "Tech-driven business support",
    ],
    cta: {
      heading: "Embrace the digital future",
      description:
        "Join the IT sector and be at the forefront of technological innovation. Register today.",
    },
  },
  {
    key: "solar",
    tagline: "Powering a sustainable tomorrow",
    overview: [
      "Our Solar Energy sector promotes sustainable energy through solar power installation, distribution, and renewable energy solutions.",
      "We make clean energy accessible and affordable for homes, businesses, and communities.",
    ],
    features: [
      {
        title: "Solar Installation",
        description:
          "Professional installation of solar panels and systems for residential and commercial use.",
      },
      {
        title: "Renewable Energy Distribution",
        description:
          "Distribution of solar components, batteries, and renewable energy products.",
      },
      {
        title: "Sustainable Power Solutions",
        description:
          "Custom-designed solar solutions for off-grid communities and energy-independent living.",
      },
    ],
    benefits: [
      "Clean, renewable energy access",
      "Reduced electricity costs",
      "Solar product distribution opportunities",
      "Off-grid power solutions",
    ],
    cta: {
      heading: "Go solar with LifeLink",
      description:
        "Join the renewable energy revolution. Register to explore solar solutions.",
    },
  },
];

export function getSector(key: string): SectorDetail | undefined {
  return sectors.find((s) => s.key === key);
}
