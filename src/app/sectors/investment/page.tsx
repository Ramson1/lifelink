import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  CalendarClock,
  CheckCircle2,
  Award,
  TrendingUp,
  ShieldCheck,
  Banknote,
} from "lucide-react";

import { Container } from "@/components/Container";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, buildMetadata, serviceLd } from "@/lib/seo";
import {
  INVESTMENT_DURATIONS,
  INVESTMENT_TIERS,
} from "@/lib/registration/investment-schema";

const BRAND = "linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)";

export const metadata = buildMetadata({
  title: "LifeLink Investment and Savings",
  description:
    "Invest with LifeLink and earn 36% per annum (3% monthly flat rate). Six tiers from ₦50,000 to Premium, flexible 90–365 day durations, and Pioneer recognition with LifeLink Group shares.",
  path: "/sectors/investment",
  keywords: [
    "LifeLink Investment and Savings",
    "investment Nigeria",
    "36% per annum investment",
    "monthly interest investment",
    "save and invest",
  ],
});

export default function InvestmentSectorPage() {
  return (
    <div className="min-h-screen">
      <JsonLd
        data={[
          serviceLd({
            name: "LifeLink Investment and Savings",
            description: "Let Your Money Work For You — 36% per annum, 3% monthly flat rate.",
            path: "/sectors/investment",
            serviceType: "Investment",
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: "LifeLink Investment and Savings", path: "/sectors/investment" },
          ]),
        ]}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: BRAND }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full"
            style={{ background: "rgba(255,255,255,0.35)" }}
          />
          <div
            className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full"
            style={{ background: "rgba(255,255,255,0.25)" }}
          />
        </div>

        <Container className="relative py-20 sm:py-28">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all sectors
          </Link>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/50 bg-amber-400/20 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-amber-100">
            <BadgePercent className="h-4 w-4" />
            Pre-launch · Now accepting Pioneer subscriptions
          </div>

          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/15 backdrop-blur-sm">
              <TrendingUp className="h-10 w-10 text-white" strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-white/70">
                Let Your Money Work For You
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                LifeLink Investment and Savings
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-xl leading-9 text-white/90">
            Earn <strong className="font-extrabold">36% per annum</strong> — paid
            monthly at a transparent <strong className="font-extrabold">3% flat
            rate</strong> on your original investment. Choose from six tiers
            starting at ₦50,000.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register?service=investment"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition-all hover:scale-105"
            >
              Subscribe Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#tiers"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              View investment tiers
            </a>
          </div>
        </Container>
      </section>

      {/* Rate highlights */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BadgePercent,
                stat: "36%",
                label: "Per Annum",
                desc: "Payable and retainable interest rate on your investment.",
              },
              {
                icon: Banknote,
                stat: "3%",
                label: "Monthly Payout",
                desc: "Flat rate paid every month on your original capital.",
              },
              {
                icon: CalendarClock,
                stat: "90–365",
                label: "Day Durations",
                desc: "Flexible terms: 90, 120, 180 or 365 days.",
              },
            ].map((card, i) => (
              <ScrollReveal key={card.label} delay={i * 100}>
                <div className="h-full rounded-3xl border border-black/10 bg-white p-7 text-center dark:border-white/20 dark:bg-slate-900">
                  <div
                    className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                    style={{ background: BRAND }}
                  >
                    <card.icon className="h-7 w-7" strokeWidth={1.8} />
                  </div>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    {card.stat}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
                    {card.label}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {card.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Tiers grid */}
      <section id="tiers" className="relative py-20 sm:py-28">
        <MeshGradient variant="ocean" />
        <Container className="relative">
          <ScrollReveal>
            <div className="mb-3 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">
                Investment tiers
              </div>
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
            </div>
            <h2 className="mb-4 text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Six tiers, one clear rate
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-600 dark:text-slate-300">
              Every tier earns the same 3% monthly flat rate — the returns scale
              with your capital.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INVESTMENT_TIERS.map((tier, i) => (
              <ScrollReveal key={tier.key} delay={i * 80}>
                <div className="flex h-full flex-col rounded-3xl border border-black/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg dark:border-white/20 dark:bg-slate-900">
                  <div className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
                    {tier.category}
                  </div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {tier.label}
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                    {tier.range}
                  </div>
                  <div className="mt-auto pt-5">
                    <div
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white"
                      style={{ background: BRAND }}
                    >
                      <Banknote className="h-4 w-4" />
                      {tier.monthlyInterest}/month
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Duration + Pioneer recognition */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Choose your investment duration
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                  Your capital is deployed for a fixed term and returns are paid
                  monthly at a 3% flat rate calculated on your original
                  investment only — simple and transparent. At the end of your
                  term, your capital is returned.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {INVESTMENT_DURATIONS.map((d) => (
                    <div
                      key={d.value}
                      className="rounded-2xl border-2 border-black/10 bg-black/[0.02] py-4 text-center dark:border-white/15 dark:bg-white/[0.03]"
                    >
                      <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {d.value}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Days
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div
                className="relative overflow-hidden rounded-3xl p-8 text-white sm:p-10"
                style={{ background: BRAND }}
              >
                <Award className="mb-4 h-12 w-12 text-amber-300" strokeWidth={1.6} />
                <h3 className="text-3xl font-extrabold">Pioneer Recognition</h3>
                <p className="mt-4 text-lg leading-8 text-white/90">
                  Pilot and first-phase investors are regarded as{" "}
                  <strong className="font-extrabold">PIONEERS</strong> and
                  automatically receive{" "}
                  <strong className="font-extrabold">LIFELINK GROUP SHARES</strong>{" "}
                  — rewarding you for believing in us from the very beginning.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Free LifeLink Group shares for early investors",
                    "Priority engagement on approved programs",
                    "Additional recognition for Premium tier",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-amber-300" />
                      <span className="text-base font-semibold">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Promotional graphics */}
      <section className="relative py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="mb-3 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">
                At a glance
              </div>
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
            </div>
            <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              How your money grows
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { src: "/investment/tiers.jpg", alt: "LifeLink investment tiers" },
              { src: "/investment/interest.jpg", alt: "36% per annum, 3% monthly interest" },
              { src: "/investment/payout.jpg", alt: "Monthly payout schedule" },
            ].map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 100}>
                <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg dark:border-white/20 dark:bg-slate-900">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={1000}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why invest */}
      <section className="relative py-20 sm:py-28">
        <MeshGradient variant="sunset" />
        <Container className="relative">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Why invest with LifeLink
            </h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "36% per annum — payable and retainable",
              "3% monthly flat rate on original investment",
              "Flexible 90, 120, 180 or 365 day terms",
              "Pioneer recognition with LifeLink Group shares",
              "Secure bank transfer or teller payments",
              "Returns paid straight to your bank account",
              "Regulated KYC process keeps you safe",
              "Backed by 21 years of LifeLink excellence",
            ].map((b, i) => (
              <ScrollReveal key={b} delay={i * 60}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur-sm dark:border-white/20 dark:bg-slate-900/70">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[var(--accent)]" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-white/80">
                    {b}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden py-16 text-white sm:py-20"
        style={{ background: BRAND }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute right-0 top-0 h-80 w-80 rounded-full"
            style={{ background: "rgba(255,255,255,0.3)" }}
          />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Ready to let your money work for you?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90">
              Complete the investment subscription form and our team will guide
              you through payment and activation.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register?service=investment"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition-all hover:scale-105"
              >
                Subscribe Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
