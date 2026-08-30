export const brand = {
  name: "LifeLink Group International Limited",
  shortName: "LifeLink Group",
  rcNumber: "CAC Registered, Nigeria",
  tagline: "Turning Ordinary People Into Extraordinary Heroes",
  intro:
    "LifeLink Group International Limited is a partnership and community-based organization dedicated to empowering individuals, transforming communities and creating sustainable economic opportunities.",
  about:
    "Our apex organization, LifeLink Group International Limited is fully registered with the Corporate Affairs Commission (CAC) of Nigeria and oversees six subsidiary organizations operating across diverse sectors. With over 21 years of excellence, we are dedicated to empowering individuals, reducing poverty and creating sustainable opportunities for families, partners, businesses and communities down to the rural localities. We have remained committed to promoting integrity, transparency and quality service which are the core values that inspire us.",
  mission:
    "To alleviate poverty and build wealth through strategic partnership, cooperative development, accountable investment and impactful humanitarian services.",
  vision:
    "To be Africa's leading community-driven conglomerate and creating sustainable platforms for wealth and human development.",
  values: [
    "Honesty",
    "Transparency",
    "Integrity",
    "Accountability",
    "Excellence",
    "Service",
    "Compassion",
    "Empowerment",
  ],
  whyChoose: [
    {
      title: "Tested and Trusted",
      description: "21 years of proven excellence and reliability.",
    },
    {
      title: "Fully Registered",
      description: "CAC-registered organization in Nigeria.",
    },
    {
      title: "Strong Operational Structure",
      description: "Six fully functional subsidiary organizations.",
    },
    {
      title: "Humanitarian Impact",
      description: "Delivering strong and active support to communities.",
    },
    {
      title: "Transparent Leadership",
      description: "Accountable and transparent governance.",
    },
    {
      title: "Sustainable Investment",
      description: "Multidimensional investment horizons.",
    },
    {
      title: "Generational Legacy",
      description: "Building self-sustaining generational ecosystems.",
    },
    {
      title: "Member-Driven",
      description: "Powered by a strong member-driven foundation.",
    },
  ],
  founder: {
    name: "Pastor Obi Nwagbo",
    role: "DG/President & Chief Executive Officer",
    bio: "A humanitarian, entrepreneur, business consultant, community mobilizer, and empowerment advocate.",
  },
  contact: {
    email: "lifelinkgroup365@gmail.com",
    phones: [
      "+234 810 148 9935",
      "+234 803 216 6698",
      "+234 913 206 8307",
      "+234 905 027 7240",
      "+234 803 152 3110",
      "+234 814 705 8460",
    ],
    address:
      "2 Odu Avenue, East-West Road, Rumudara, Port Harcourt, Rivers State, Nigeria",
  },
  office: {
    city: "Port Harcourt",
    state: "Rivers State",
    country: "Nigeria",
  },
};

export type ServiceKey =
  | "humanitarian"
  | "finance"
  | "trading"
  | "affiliate"
  | "mlm"
  | "production"
  | "investment"
  | "landbanking"
  | "transport"
  | "agriculture"
  | "oilgas"
  | "digital";

export const services: Array<{
  key: ServiceKey;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  icon: string;
  color: [string, string];
}> = [
  {
    key: "humanitarian",
    title: "Humanitarian",
    subtitle: "Youth empowerment & community development",
    description:
      "Supporting youth empowerment and community development through impactful social intervention programs.",
    highlights: ["Youth empowerment", "Social interventions", "Community development"],
    icon: "HandHeart",
    color: ["#f43f5e", "#ec4899"],
  },
  {
    key: "finance",
    title: "Finance",
    subtitle: "Innovative financial solutions",
    description:
      "Providing innovative financial solutions that promote economic growth.",
    highlights: ["Economic growth", "Financial solutions", "Member support"],
    icon: "Wallet",
    color: ["#10b981", "#059669"],
  },
  {
    key: "trading",
    title: "Trading",
    subtitle: "Local & international trade",
    description:
      "Engaging in local and international trade across diverse industries.",
    highlights: ["Local trade", "International trade", "Diverse industries"],
    icon: "TrendingUp",
    color: ["#3b82f6", "#2563eb"],
  },
  {
    key: "affiliate",
    title: "Affiliate Marketing",
    subtitle: "Performance-based income",
    description:
      "Creating legitimate income opportunities through performance-based marketing.",
    highlights: ["Legitimate income", "Performance-based", "Flexible earning"],
    icon: "Share2",
    color: ["#f97316", "#ea580c"],
  },
  {
    key: "mlm",
    title: "Multi-Level Marketing (MLM)",
    subtitle: "Structured networking",
    description:
      "Offering structured networking opportunities for both corporate and individual business growth.",
    highlights: ["Corporate growth", "Individual growth", "Structured network"],
    icon: "Network",
    color: ["#a855f7", "#9333ea"],
  },
  {
    key: "production",
    title: "Production",
    subtitle: "Quality goods & services",
    description:
      "Producing diverse quality goods and services to meet our target market demands.",
    highlights: ["Quality goods", "Diverse products", "Market-driven"],
    icon: "Package",
    color: ["#eab308", "#ca8a04"],
  },
  {
    key: "investment",
    title: "Investment & Loans",
    subtitle: "Capital & financial aid",
    description:
      "Providing investment opportunities and empowering the community with start-up capital and financial aid.",
    highlights: ["Start-up capital", "Investment options", "Financial aid"],
    icon: "PiggyBank",
    color: ["#6366f1", "#4f46e5"],
  },
  {
    key: "landbanking",
    title: "Land Banking",
    subtitle: "Choice landed properties",
    description:
      "Assisting individuals and investors to acquire choice landed properties for use and future returns.",
    highlights: ["Choice properties", "Future returns", "Investor support"],
    icon: "LandPlot",
    color: ["#84cc16", "#65a30d"],
  },
  {
    key: "transport",
    title: "Transportation",
    subtitle: "Reliable transport services",
    description:
      "Delivering reliable transport services with structured, viable payment systems.",
    highlights: ["Reliable transport", "Flexible payment", "Structured plans"],
    icon: "Bus",
    color: ["#06b6d4", "#0891b2"],
  },
  {
    key: "agriculture",
    title: "Agriculture",
    subtitle: "Food security & agro-investment",
    description:
      "Promoting food security through modern agribusinesses and agro-investment.",
    highlights: ["Food security", "Agribusiness", "Agro-investment"],
    icon: "Wheat",
    color: ["#84cc16", "#22c55e"],
  },
  {
    key: "oilgas",
    title: "Oil & Gas",
    subtitle: "Energy sector partnership",
    description:
      "Participating through partnership and investment in Nigeria's energy sector.",
    highlights: ["Energy sector", "Partnerships", "Investment"],
    icon: "Fuel",
    color: ["#0ea5e9", "#1e40af"],
  },
  {
    key: "digital",
    title: "Blockchain & Digital Assets",
    subtitle: "Digital asset advisory",
    description:
      "Providing blockchain education, digital asset advisory, and tokenization solutions.",
    highlights: ["Blockchain education", "Asset advisory", "Tokenization"],
    icon: "Blocks",
    color: ["#8b5cf6", "#6366f1"],
  },
];
