import Link from "next/link";
import * as lucideIcons from "lucide-react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { Container } from "@/components/Container";
import { GradientOrbs } from "@/components/GradientOrbs";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { services as hardcodedServices } from "@/lib/brand";
import { createServiceClient } from "@/lib/admin/supabase";

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
  highlights: string[];
  icon: string;
  color: [string, string];
}

function getIcon(name: string) {
  const Icon = (lucideIcons as any)[name];
  return Icon ?? null;
}

async function getDbSectors(): Promise<DbSector[]> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("lifelink_sectors")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const dbSectors = await getDbSectors();

  // DB-first: if DB has sectors, use only DB. Otherwise fall back to hardcoded.
  const merged: MergedService[] =
    dbSectors.length > 0
      ? dbSectors.map((s) => ({
          key: s.key,
          title: s.title,
          subtitle: s.subtitle,
          description: s.description,
          highlights: (s.benefits ?? []).slice(0, 3),
          icon: s.icon,
          color: [s.color_from, s.color_to] as [string, string],
        }))
      : hardcodedServices.map((s) => ({
          key: s.key,
          title: s.title,
          subtitle: s.subtitle,
          description: s.description,
          highlights: s.highlights,
          icon: s.icon,
          color: s.color as [string, string],
        }));

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20 sm:py-28 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <GradientOrbs variant="cool" />
        <Container className="relative">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
                <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">Services</div>
                <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                Explore our sectors
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                From humanitarian services to finance, agriculture, energy, and digital assets. Start with e-registration and select your preferred sector.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Sectors Grid */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <MeshGradient variant="aurora" />
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {merged.map((s, index) => {
              const Icon = getIcon(s.icon);
              const [from, to] = s.color;
              const isFeatured = index === 0;
              return (
                <ScrollReveal key={s.key} delay={index * 80}>
                  <Link
                    href={`/sectors/${s.key}`}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-transparent dark:border-slate-700 dark:bg-slate-900 ${isFeatured ? "ring-2 ring-amber-400/50" : ""}`}
                  >
                    {isFeatured && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/50">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      </div>
                    )}
                    <div
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                        boxShadow: `0 10px 25px -10px ${from}aa`,
                      }}
                    >
                      {Icon && <Icon className="h-8 w-8" strokeWidth={1.8} />}
                    </div>

                    <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {s.title}
                    </h3>

                    <p className="mt-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                      {s.subtitle}
                    </p>

                    <p className="mt-4 flex-grow text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {s.description}
                    </p>

                    {s.highlights.length > 0 && (
                      <ul role="list" className="mt-6 space-y-2 border-t border-slate-100 dark:border-white/20 pt-5">
                        {s.highlights.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="h-4 w-4 flex-none text-cyan-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                      Explore sector <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <ScrollReveal>
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-600 p-10 text-center text-white sm:p-16">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl" style={{ color: "#ffffff" }}>
                Ready to get started?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-8" style={{ color: "rgba(255,255,255,0.95)" }}>
                Register today and choose the sector that aligns with your goals. Our team is ready to guide you every step of the way.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl hover:scale-105 transition-all"
                >
                  Start Registration <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </div>
  );
}
