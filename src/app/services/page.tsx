import Link from "next/link";
import * as lucideIcons from "lucide-react";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { services } from "@/lib/brand";

function getIcon(name: string) {
  const Icon = (lucideIcons as any)[name];
  return Icon ?? null;
}

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-14 sm:pt-32 sm:pb-18">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Explore our sectors"
          description="From humanitarian services to finance, agriculture, energy, and digital assets. Start with e-registration and select your preferred sector."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {services.map((s) => {
            const Icon = getIcon(s.icon);
            const [from, to] = s.color;
            return (
              <div
                key={s.key}
                className="rounded-3xl border border-black/10 bg-white/70 p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-white"
                      style={{
                        background: `linear-gradient(135deg, ${from}, ${to})`,
                        boxShadow: `0 8px 20px -8px ${from}aa`,
                      }}
                    >
                      {Icon && <Icon className="h-6 w-6" strokeWidth={1.8} />}
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-black">{s.title}</div>
                      <div className="mt-1 text-sm text-black/70">{s.subtitle}</div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-black/70">
                  {s.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {s.highlights.map((h) => (
                    <div
                      key={h}
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70"
                    >
                      {h}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href={`/sectors/${s.key}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    Explore sector
                  </Link>
                  <Link
                    href={`/register?service=${s.key}`}
                    className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    Register
                  </Link>
                  <Link
                    href="/contact"
                    className="ml-auto inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    Ask a question
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
