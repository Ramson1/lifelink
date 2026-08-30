import type { FaqAnswerBlock } from "@/components/FaqAccordion";

export interface DefaultFaq {
  id: string;
  question: string;
  answerBlocks: FaqAnswerBlock[];
}

export const defaultFaqs: DefaultFaq[] = [
  {
    id: "faq-1",
    question: "What is LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "LIFELINK GROUP is a community-based organization dedicated to empowering people through humanitarian services, cooperative development, investments, entrepreneurship, agriculture, digital innovation, and grassroots development." },
    ],
  },
  {
    id: "faq-2",
    question: "What is the vision of LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "To build the largest community-based organization in Africa while transforming ordinary people into extraordinary heroes." },
    ],
  },
  {
    id: "faq-3",
    question: "What is the mission of LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "To empower people, reduce poverty, create opportunities, and improve lives through sustainable programs and community-driven initiatives." },
    ],
  },
  {
    id: "faq-4",
    question: "Is LifeLink Group legally registered?",
    answerBlocks: [
      { type: "text", content: "Yes. LIFELINK GROUP INTERNATIONAL LIMITED is duly registered with the Corporate Affairs Commission (CAC) of Nigeria." },
    ],
  },
  {
    id: "faq-5",
    question: "Who is the founder/CEO of LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "LIFELINK Group was founded by Pst. Sylvester Obi Nwagbo, a humanitarian, entrepreneur, business consultant, community mobilizer, and empowerment advocate." },
    ],
  },
  {
    id: "faq-6",
    question: "Who can become a member of LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "Any honest and law-abiding individual who shares the vision and values of LIFELINK Group can apply for membership." },
    ],
  },
  {
    id: "faq-7",
    question: "What are the benefits of membership?",
    answerBlocks: [
      { type: "text", content: "Members may enjoy:" },
      { type: "list", items: [
        "Networking opportunities",
        "Business and investment exposure",
        "Training and empowerment programs",
        "Cooperative benefits",
        "Humanitarian support initiatives",
        "Leadership opportunities",
        "Access to community projects",
      ]},
    ],
  },
  {
    id: "faq-8",
    question: "What sectors does LifeLink Group operate in?",
    answerBlocks: [
      { type: "text", content: "LIFELINK GROUP operates in:" },
      { type: "list", items: [
        "Humanitarian Services",
        "Cooperative Society",
        "Finance",
        "Trading",
        "Affiliate Marketing",
        "Multilevel Marketing",
        "Agriculture",
        "Food Bank",
        "Transportation",
        "Land Banking",
        "Oil & Gas",
        "Information Technology",
        "Digital Assets",
        "Investment and Loans",
      ]},
    ],
  },
  {
    id: "faq-9",
    question: "What is the Food Bank Initiative?",
    answerBlocks: [
      { type: "text", content: "The Food Bank Initiative is designed to provide food support and subsidized food supplies to vulnerable individuals and families." },
    ],
  },
  {
    id: "faq-10",
    question: "What is Project 2030?",
    answerBlocks: [
      { type: "text", content: "Project 2030 is LIFELINK GROUP's strategic development roadmap focused on membership growth, digital transformation, food security, business expansion, empowerment programs, and grassroots development across Nigeria." },
    ],
  },
  {
    id: "faq-11",
    question: "How does LifeLink empower people?",
    answerBlocks: [
      { type: "text", content: "We do this through:" },
      { type: "list", items: [
        "Skill acquisition training",
        "Business mentorship",
        "Cooperative services",
        "Investment opportunities",
        "Leadership development",
        "Humanitarian interventions",
        "Community development projects",
      ]},
    ],
  },
  {
    id: "faq-12",
    question: "Does LifeLink offer loans?",
    answerBlocks: [
      { type: "text", content: "Yes. Through its cooperative and financial structures, qualified members may have access to financial support and loan opportunities subject to policies and requirements." },
    ],
  },
  {
    id: "faq-13",
    question: "Can organizations partner with LifeLink?",
    answerBlocks: [
      { type: "text", content: "Yes. LIFELINK welcomes partnerships with government agencies, NGOs, corporate organizations, faith-based groups, and development partners." },
    ],
  },
  {
    id: "faq-14",
    question: "How can I become a coordinator or leader in LifeLink?",
    answerBlocks: [
      { type: "text", content: "Interested individuals can apply through the organization's recruitment and leadership development processes when opportunities are announced." },
    ],
  },
  {
    id: "faq-15",
    question: "What are the core values of LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "Our values include:" },
      { type: "list", items: [
        "Honesty",
        "Transparency",
        "Integrity",
        "Accountability",
        "Excellence",
        "Service",
        "Compassion",
        "Empowerment",
      ]},
    ],
  },
  {
    id: "faq-16",
    question: "How can I support the vision of LifeLink?",
    answerBlocks: [
      { type: "text", content: "You can support by:" },
      { type: "list", items: [
        "Becoming a member",
        "Volunteering",
        "Referring others",
        "Partnering with the organization",
        "Participating in projects",
        "Supporting humanitarian programs",
      ]},
    ],
  },
  {
    id: "faq-17",
    question: "What makes LifeLink Group different?",
    answerBlocks: [
      { type: "text", content: "LIFELINK GROUP combines humanitarian service, economic empowerment, cooperative development, entrepreneurship and community transformation under one platform." },
    ],
  },
  {
    id: "faq-18",
    question: "What is the official slogan of LifeLink Group?",
    answerBlocks: [
      { type: "text", content: '"Turning Ordinary People Into Extraordinary Heroes."' },
    ],
  },
  {
    id: "faq-19",
    question: "What is the long-term goal of LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "To create sustainable opportunities for millions of people and become Africa's leading community-based empowerment organization." },
    ],
  },
  {
    id: "faq-20",
    question: "How can I contact LifeLink Group?",
    answerBlocks: [
      { type: "text", content: "Through our contact details, official social media handles and office addresses available through LIFELINK GROUP official communication channels." },
    ],
  },
  {
    id: "faq-21",
    question: "How does the Cooperative Department work?",
    answerBlocks: [
      { type: "text", content: "The Cooperative Department serves as the financial backbone of LIFELINK Group. Members make regular contributions and may enjoy access to savings plans, loans, investment opportunities, and other cooperative benefits. The department operates on the principles of accountability, transparency, and mutual support." },
    ],
  },
  {
    id: "faq-22",
    question: "What is the process for obtaining loans?",
    answerBlocks: [
      { type: "text", content: "Members seeking loans must:" },
      { type: "list", items: [
        "Be a registered LIFELINK GROUP member",
        "Meet the minimum contribution requirements",
        "Complete a loan application form",
        "Provide required guarantors or security where applicable",
        "Obtain approval from the appropriate committee",
      ]},
      { type: "text", content: "Loan approval is based on eligibility, repayment capacity, and compliance with LIFELINK GROUP policies." },
    ],
  },
  {
    id: "faq-23",
    question: "How does the Food Bank Subsidy Program operate?",
    answerBlocks: [
      { type: "text", content: "The Food Bank Program is designed to help individuals and families access food items at subsidized rates or through support interventions. Beneficiaries may register through designated channels and participate according to program guidelines and availability." },
    ],
  },
];
