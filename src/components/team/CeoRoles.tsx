"use client";

import { useState } from "react";
import {
  Brain,
  BriefcaseBusiness,
  ChevronDown,
  ClipboardCheck,
  Flame,
  Handshake,
  HeartHandshake,
  Megaphone,
  Network,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Role {
  label: string;
  icon: typeof Rocket;
  description: string;
}

const CEO_ROLES: Role[] = [
  {
    label: "Entrepreneur",
    icon: Rocket,
    description:
      "A serial entrepreneur who has built LifeLink Group from a cooperative society into a diversified organisation spanning multiple sectors of the economy.",
  },
  {
    label: "Business Consultant / Leader",
    icon: BriefcaseBusiness,
    description:
      "Advises individuals and businesses on growth strategy, structure and sustainability, while leading a team that turns vision into measurable results.",
  },
  {
    label: "Networker",
    icon: Network,
    description:
      "Connects people, opportunities and resources across communities, building bridges between members, investors and strategic partners.",
  },
  {
    label: "Grassroot Mobilizer",
    icon: Megaphone,
    description:
      "Rallies ordinary people at the grassroots, empowering them to organise, participate and grow together through collective action.",
  },
  {
    label: "Investment Expert",
    icon: TrendingUp,
    description:
      "Guides members toward sound investment decisions and wealth creation, championing the belief that kindness is the best investment.",
  },
  {
    label: "Humanitarian",
    icon: HeartHandshake,
    description:
      "Leads humanitarian and community-development initiatives — from medical outreach to skill acquisition — that improve quality of life for many.",
  },
  {
    label: "Mindset Coach",
    icon: Brain,
    description:
      "Mentors individuals to shift limiting beliefs, cultivate an abundance mentality and pursue personal and financial breakthroughs.",
  },
  {
    label: "Professional Coordinator / Organizer",
    icon: ClipboardCheck,
    description:
      "Coordinates programmes, events and projects with precision, ensuring ideas are delivered on time and to a high standard.",
  },
  {
    label: "Revivalist",
    icon: Flame,
    description:
      "As a lead minister, ignites spiritual and moral renewal, inspiring hope, faith and purpose in the lives of those he reaches.",
  },
  {
    label: "Team Builder & Negotiator",
    icon: Handshake,
    description:
      "Builds cohesive, high-trust teams and negotiates win-win partnerships that advance the mission of the organisation.",
  },
];

export function CeoRoles() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <div className="border-b border-slate-200 px-8 py-8 dark:border-slate-700 sm:px-10">
      <div className="mb-5 flex items-center gap-3">
        <Sparkles className="h-5 w-5 flex-none text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile / Roles</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/40 to-transparent" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CEO_ROLES.map(({ label, icon: Icon, description }, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={label}
              className={`overflow-hidden rounded-2xl border bg-slate-50/60 transition-all dark:bg-slate-800/60 ${
                isOpen
                  ? "border-indigo-400 shadow-md ring-1 ring-indigo-300/50 dark:border-indigo-500/60 dark:ring-indigo-500/30"
                  : "border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100">
                  {label}
                </span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 flex-none text-slate-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-3 pb-3 text-xs leading-6 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
