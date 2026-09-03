import Link from "next/link";
import { ArrowRight, Heart, HandHeart, TrendingUp } from "lucide-react";

import { Container } from "@/components/Container";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    title: `Fundraise — ${brand.shortName}`,
    description:
      "Support LifeLink Group's fundraising campaigns across sectors. Help us empower communities and transform lives.",
  };
}

const campaigns = [
  {
    title: "Youth Empowerment Fund",
    description: "Support skills acquisition, vocational training, and startup capital for young people in underserved communities across Rivers State.",
    sector: "Humanitarian",
    target: 5000000,
    raised: 1250000,
    icon: HandHeart,
  },
  {
    title: "Agricultural Development Fund",
    description: "Help provide modern farming equipment, seeds, and training to rural farming communities to boost food security and livelihoods.",
    sector: "Agriculture",
    target: 8000000,
    raised: 2400000,
    icon: TrendingUp,
  },
  {
    title: "Community Health Initiative",
    description: "Fund mobile health clinics, medical supplies, and health education programs for rural communities in Niger Delta.",
    sector: "Humanitarian",
    target: 3000000,
    raised: 800000,
    icon: Heart,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function FundraisePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-amber-50 py-20 sm:py-28 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Container className="relative">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-sm font-semibold text-rose-700 mb-6">
                <Heart className="h-4 w-4" /> Make a Difference
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                Fundraise with LifeLink
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Support our campaigns to empower communities, transform lives, and create sustainable opportunities across Nigeria. Every contribution counts.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Active Campaigns */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <MeshGradient variant="sunset" />
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">Active Campaigns</div>
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Current fundraisers</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Browse our active campaigns and contribute to the causes that matter to you.</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-3">
            {campaigns.map((campaign, i) => {
              const Icon = campaign.icon;
              const progress = Math.min(100, Math.round((campaign.raised / campaign.target) * 100));
              return (
                <ScrollReveal key={campaign.title} delay={i * 120}>
                  <div className="group h-full rounded-3xl border border-slate-200 bg-white overflow-hidden transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <Icon className="h-8 w-8 opacity-80" />
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                          {campaign.sector}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-bold">{campaign.title}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{campaign.description}</p>

                      <div className="mt-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(campaign.raised)} raised</span>
                          <span className="text-slate-500 dark:text-slate-400">{progress}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          Target: {formatCurrency(campaign.target)}
                        </div>
                      </div>

                      <Link
                        href="/contact"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Heart className="h-4 w-4" /> Contribute
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">How It Works</div>
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">Making an impact is simple</h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Choose a campaign", desc: "Browse our active fundraisers and find a cause that resonates with you." },
              { step: "2", title: "Get in touch", desc: "Contact us to express your interest in contributing. We'll guide you through the process." },
              { step: "3", title: "Make your impact", desc: "Your contribution directly supports communities and individuals in need." },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 120}>
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <div className="rounded-3xl bg-gradient-to-br from-rose-600 to-amber-600 p-10 text-center text-white sm:p-16">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Want to start a campaign?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/90">
                Partner with LifeLink Group to launch a fundraising campaign for your cause. Together, we can create lasting change.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:scale-105 transition-all"
              >
                Partner with us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
