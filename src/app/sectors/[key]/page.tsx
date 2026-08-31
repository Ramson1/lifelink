import Link from "next/link";
import { notFound } from "next/navigation";
import * as icons from "lucide-react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { Container } from "@/components/Container";
import { GradientOrbs } from "@/components/GradientOrbs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand, services } from "@/lib/brand";
import { getSector } from "@/data/sectors";

export const dynamic = "force-dynamic";

interface DbSector {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color_from: string;
  color_to: string;
  tagline: string;
  overview: string[];
  features: { title: string; description: string }[];
  benefits: string[];
  is_active: boolean;
  accepting_registrations: boolean;
}

interface MergedService {
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: [string, string];
}

async function getDbSectors(): Promise<DbSector[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/sectors`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.items ?? [];
  } catch {
    return [];
  }
}

function getIcon(name: string) {
  const Icon = (icons as any)[name];
  return Icon ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const key = (params as any).key as string;
  const dbSectors = await getDbSectors();
  const dbSector = dbSectors.find((s) => s.key === key);
  const hardcodedService = services.find((s) => s.key === key);

  const title = dbSector?.title ?? hardcodedService?.title;
  const description = dbSector?.description ?? hardcodedService?.description;
  if (!title) return {};
  return {
    title: `${title} — ${brand.shortName}`,
    description: description ?? "",
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const dbSectors = await getDbSectors();

  // Build merged service list (hardcoded + DB)
  const dbKeys = new Set(dbSectors.map((s) => s.key));
  const allServices: MergedService[] = [
    ...services
      .filter((s) => !dbKeys.has(s.key))
      .map((s) => ({
        key: s.key,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        icon: s.icon,
        color: s.color as [string, string],
      })),
    ...dbSectors.map((s) => ({
      key: s.key,
      title: s.title,
      subtitle: s.subtitle,
      description: s.description,
      icon: s.icon,
      color: [s.color_from, s.color_to] as [string, string],
    })),
  ];

  // Try DB sector first, then fall back to hardcoded
  const dbSector = dbSectors.find((s) => s.key === key);
  const hardcodedService = services.find((s) => s.key === key);
  const hardcodedSector = getSector(key);

  // Must exist in at least one source
  if (!dbSector && !hardcodedService) return notFound();

  // Resolve data: DB takes priority, hardcoded as fallback
  const title = dbSector?.title ?? hardcodedService?.title ?? "";
  const subtitle = dbSector?.subtitle ?? hardcodedService?.subtitle ?? "";
  const iconName = dbSector?.icon ?? hardcodedService?.icon ?? "Star";
  const tagline = dbSector?.tagline ?? hardcodedSector?.tagline ?? "";
  const overview = dbSector?.overview ?? hardcodedSector?.overview ?? [];
  const features = dbSector?.features ?? hardcodedSector?.features ?? [];
  const benefits = dbSector?.benefits ?? hardcodedSector?.benefits ?? [];
  const ctaHeading = hardcodedSector?.cta?.heading ?? `Join the ${title} sector`;
  const ctaDescription = hardcodedSector?.cta?.description ?? `Register now and explore opportunities in ${title}.`;

  const Icon = getIcon(iconName);
  const related = allServices.filter((s) => s.key !== key).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full"
            style={{ background: "rgba(255,255,255,0.3)" }}
          />
          <div
            className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />
        </div>

        <Container className="relative py-20 sm:py-28">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all sectors
          </Link>

          <div className="flex items-center gap-5 mb-6">
            {Icon && (
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm border border-white/20">
                <Icon className="h-10 w-10 text-white" strokeWidth={1.8} />
              </div>
            )}
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-white/70">
                {subtitle}
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                {title}
              </h1>
            </div>
          </div>

          <p className="max-w-3xl text-xl leading-9 text-white/90">
            {tagline}
          </p>
        </Container>
      </section>

      {/* Overview */}
      {overview.length > 0 && (
        <section className="relative py-20 sm:py-28">
          <GradientOrbs variant="warm" className="opacity-40" />
          <Container className="relative">
            <ScrollReveal>
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Overview</div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-8">
                About the {title} sector
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="max-w-3xl space-y-6">
                {overview.map((p, i) => (
                  <p key={i} className="text-base leading-8 text-slate-700">
                    {p}
                  </p>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-20 sm:py-28 bg-slate-50/60">
          <Container>
            <ScrollReveal>
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">What we offer</div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Key features</h2>
              <p className="text-lg text-slate-600 mb-12 max-w-2xl">Core capabilities of the {title} sector.</p>
            </ScrollReveal>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 100}>
                  <div className="h-full rounded-3xl border border-black/10 bg-white p-7 transition hover:shadow-lg hover:-translate-y-1">
                    <div
                      className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                      style={{ background: "linear-gradient(135deg, #0f172a, #1d4ed8)" }}
                    >
                      <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div className="text-lg font-semibold text-slate-900">{f.title}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{f.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="relative py-20 sm:py-28">
          <GradientOrbs variant="cool" className="opacity-30" />
          <Container className="relative">
            <ScrollReveal>
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Member benefits</div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-12">Why join this sector</h2>
            </ScrollReveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((b, i) => (
                <ScrollReveal key={b} delay={i * 80}>
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-black/10 bg-white/70 p-5 backdrop-blur-sm">
                    <div
                      className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-white"
                      style={{ background: "linear-gradient(135deg, #0f172a, #1d4ed8)" }}
                    >
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">{b}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section
        className="relative overflow-hidden py-16 sm:py-20 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{ctaHeading}</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90">{ctaDescription}</p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/register?service=${key}`}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:scale-105 transition-all"
              >
                Register for {title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Related sectors */}
      {related.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <ScrollReveal>
              <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Explore more</div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">Related sectors</h2>
              <p className="text-lg text-slate-600 mb-12 max-w-2xl">Discover other sectors within LifeLink Group.</p>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r, i) => {
                const RelIcon = getIcon(r.icon);
                return (
                  <ScrollReveal key={r.key} delay={i * 100}>
                    <Link
                      href={`/sectors/${r.key}`}
                      className="group rounded-3xl border border-black/10 bg-white/70 p-6 transition hover:bg-white hover:shadow-lg"
                    >
                      {RelIcon && (
                        <div
                          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                          style={{ background: "linear-gradient(135deg, #0f172a, #1d4ed8)" }}
                        >
                          <RelIcon className="h-6 w-6" strokeWidth={1.8} />
                        </div>
                      )}
                      <div className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">{r.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{r.subtitle}</div>
                      <div className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:gap-2 transition-all">
                        Explore <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
