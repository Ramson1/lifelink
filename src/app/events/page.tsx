import { Container } from "@/components/Container";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    title: `Events & Certificates — ${brand.shortName}`,
    description:
      "View LifeLink Group's events, certificates, and media gallery showcasing our milestones and achievements.",
  };
}

export default function EventsPage() {
  return (
    <div className="pt-28 pb-14 sm:pt-32 sm:pb-18">
      <Container>
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-3">Events & Media</div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">Our milestones and achievements</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stay updated with LifeLink Group&apos;s events, certifications, and memorable moments from across our sectors and communities.
            </p>
          </div>
        </ScrollReveal>

        {/* Certificates Section */}
        <ScrollReveal>
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-black">Certificates</h2>
            <p className="mt-2 text-sm text-black/70">
              Official certifications and registrations that validate our commitment to excellence.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-6 text-center">
                <div>
                  <div className="text-4xl">📜</div>
                  <div className="mt-3 text-sm font-semibold text-black">
                    CAC Registration
                  </div>
                  <div className="mt-1 text-xs text-black/60">
                    Corporate Affairs Commission
                  </div>
                </div>
              </div>
              <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-6 text-center">
                <div>
                  <div className="text-4xl">🏆</div>
                  <div className="mt-3 text-sm font-semibold text-black">
                    Industry Awards
                  </div>
                  <div className="mt-1 text-xs text-black/60">
                    Recognition of excellence
                  </div>
                </div>
              </div>
              <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-6 text-center">
                <div>
                  <div className="text-4xl">✅</div>
                  <div className="mt-3 text-sm font-semibold text-black">
                    Compliance Certificates
                  </div>
                  <div className="mt-1 text-xs text-black/60">
                    Regulatory compliance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Events Section */}
        <ScrollReveal delay={100}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black">Upcoming Events</h2>
            <p className="mt-2 text-sm text-black/70">
              Join us at our upcoming events and programs across all sectors.
            </p>
            <div className="mt-6 rounded-3xl border border-black/10 bg-white/70 p-8 text-center">
              <div className="text-4xl">📅</div>
              <div className="mt-3 text-sm font-semibold text-black">
                Events coming soon
              </div>
              <div className="mt-1 text-xs text-black/60">
                Check back for updates on conferences, workshops, and community programs.
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Media Gallery */}
        <ScrollReveal delay={200}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black">Media Gallery</h2>
            <p className="mt-2 text-sm text-black/70">
              Highlights from our events, partnerships, and community impact.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-4 text-center"
                >
                  <div>
                    <div className="text-3xl">📷</div>
                    <div className="mt-2 text-xs font-semibold text-black/60">
                      Photo {i + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
