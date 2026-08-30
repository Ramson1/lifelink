import Link from "next/link";
import { ArrowRight, Megaphone, Monitor, Newspaper, Radio, Star, Users } from "lucide-react";

import { Container } from "@/components/Container";
import { GradientOrbs } from "@/components/GradientOrbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    title: `Advertising — ${brand.shortName}`,
    description:
      "Advertise with LifeLink Group and reach thousands of members, partners, and communities across Nigeria.",
  };
}

const adFormats = [
  {
    icon: Newspaper,
    title: "Banner Ads",
    description: "Display banners across our website pages and sector portals. High visibility for brand awareness campaigns.",
  },
  {
    icon: Monitor,
    title: "Sponsored Content",
    description: "Publish sponsored articles, case studies, and thought leadership pieces on our platform.",
  },
  {
    icon: Radio,
    title: "Event Sponsorship",
    description: "Sponsor our community events, workshops, and conferences to engage directly with your target audience.",
  },
  {
    icon: Users,
    title: "Newsletter Features",
    description: "Reach our subscriber base with dedicated ad slots in our regular newsletters and updates.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "Contact us",
    features: ["Single banner placement", "1 month duration", "Basic analytics report", "1 sector page"],
    highlight: false,
  },
  {
    name: "Growth",
    price: "Contact us",
    features: ["Multi-page banner placement", "3 month duration", "Monthly analytics reports", "Newsletter feature included", "Up to 3 sector pages"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    features: ["Full platform coverage", "6 month duration", "Weekly analytics reports", "Event sponsorship included", "All sector pages", "Dedicated account manager"],
    highlight: false,
  },
];

export default function AdvertisingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 sm:py-28">
        <GradientOrbs variant="warm" />
        <Container className="relative">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700 mb-6">
                <Megaphone className="h-4 w-4" /> Advertise With Us
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                Reach thousands across Nigeria
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                LifeLink Group offers unique advertising opportunities across our platform, events, and community networks. Connect with engaged audiences in humanitarian services, finance, agriculture, and more.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Ad Formats */}
      <section className="py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Ad Formats</div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">How you can advertise</h2>
              <p className="mt-4 text-lg text-slate-600">Choose from multiple advertising formats tailored to your campaign goals.</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {adFormats.map((format, i) => {
              const Icon = format.icon;
              return (
                <ScrollReveal key={format.title} delay={i * 100}>
                  <div className="group h-full rounded-3xl border border-slate-200 bg-white p-8 transition hover:shadow-lg">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{format.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{format.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 sm:py-28 bg-slate-50/60">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Pricing</div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Advertising tiers</h2>
              <p className="mt-4 text-lg text-slate-600">Flexible packages designed for businesses of all sizes. Contact us for custom pricing.</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <ScrollReveal key={tier.name} delay={i * 120}>
                <div className={`relative h-full rounded-3xl border p-8 transition hover:shadow-lg ${tier.highlight ? "border-indigo-300 bg-white ring-2 ring-indigo-400/30" : "border-slate-200 bg-white"}`}>
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                        <Star className="h-3 w-3" /> Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-lg font-bold text-slate-900">{tier.name}</div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900">{tier.price}</div>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-indigo-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${tier.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
                  >
                    Contact us
                  </Link>
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
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-600 p-10 text-center text-white sm:p-16">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to grow your brand?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/90">
                Let&apos;s discuss how LifeLink Group can help you reach your target audience effectively. Get in touch today.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:scale-105 transition-all"
              >
                Get in touch <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
