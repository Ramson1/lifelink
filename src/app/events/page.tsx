import Image from "next/image";

import { Container } from "@/components/Container";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { brand } from "@/lib/brand";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return {
    title: `Events & Certificates — ${brand.shortName}`,
    description:
      "View LifeLink Group's events, certificates, and media gallery showcasing our milestones and achievements.",
  };
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string | null;
  image_url: string;
  is_upcoming: boolean;
}

interface CertificateItem {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  icon_emoji: string;
}

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  category: string;
}

async function fetchItems<T>(path: string): Promise<T[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.items ?? [];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const [events, certificates, gallery] = await Promise.all([
    fetchItems<EventItem>("/api/admin/events"),
    fetchItems<CertificateItem>("/api/admin/certificates"),
    fetchItems<GalleryItem>("/api/admin/gallery"),
  ]);

  return (
    <div className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-18">
      <MeshGradient variant="ocean" />
      <Container>
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
              <div className="text-lg font-bold uppercase tracking-wider text-indigo-600 dark:text-white">Events & Media</div>
              <div className="h-px w-12 bg-indigo-600/30 dark:bg-white/20" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">Our milestones and achievements</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Stay updated with LifeLink Group&apos;s events, certifications, and memorable moments from across our sectors and communities.
            </p>
          </div>
        </ScrollReveal>

        {/* Certificates Section */}
        <ScrollReveal>
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-black dark:text-white">Certificates</h2>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              Official certifications and registrations that validate our commitment to excellence.
            </p>
            {certificates.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map((cert, i) => (
                  <ScrollReveal key={cert.id} delay={i * 80}>
                    <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-6 text-center overflow-hidden dark:border-white/20 dark:bg-slate-900/70">
                      {cert.image_url ? (
                        <Image
                          src={cert.image_url}
                          alt={cert.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div>
                          <div className="text-4xl">{cert.icon_emoji}</div>
                          <div className="mt-3 text-sm font-semibold text-black dark:text-white">{cert.title}</div>
                          {cert.subtitle && <div className="mt-1 text-xs text-black/60 dark:text-white/60">{cert.subtitle}</div>}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-black/10 bg-white/70 p-8 text-center dark:border-white/20 dark:bg-slate-900/70">
                <p className="text-sm text-black/60 dark:text-white/60">Certificates will be displayed here soon.</p>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Events Section */}
        <ScrollReveal delay={100}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              {events.some((e) => e.is_upcoming) ? "Upcoming Events" : "Events"}
            </h2>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              Join us at our events and programs across all sectors.
            </p>
            {events.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((ev, i) => (
                  <ScrollReveal key={ev.id} delay={i * 80}>
                    <div className="group overflow-hidden rounded-3xl border border-black/10 bg-white/70 transition hover:shadow-lg dark:border-white/20 dark:bg-slate-900/70">
                      {ev.image_url && (
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={ev.image_url}
                            alt={ev.title}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover transition group-hover:scale-105"
                          />
                          {ev.is_upcoming && (
                            <div className="absolute top-3 left-3 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                              Upcoming
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-base font-bold text-black dark:text-white">{ev.title}</h3>
                        {ev.description && (
                          <p className="mt-1.5 text-sm leading-6 text-black/70 dark:text-white/70 line-clamp-3">{ev.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-black/50 dark:text-white/50">
                          {ev.location && <span>{ev.location}</span>}
                          {ev.event_date && (
                            <span>{new Date(ev.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-black/10 bg-white/70 p-8 text-center dark:border-white/20 dark:bg-slate-900/70">
                <div className="text-4xl">📅</div>
                <div className="mt-3 text-sm font-semibold text-black dark:text-white">Events coming soon</div>
                <div className="mt-1 text-xs text-black/60 dark:text-white/60">
                  Check back for updates on conferences, workshops, and community programs.
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Media Gallery */}
        <ScrollReveal delay={200}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black dark:text-white">Media Gallery</h2>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              Highlights from our events, partnerships, and community impact.
            </p>
            {gallery.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {gallery.map((g, i) => (
                  <ScrollReveal key={g.id} delay={i * 60}>
                    <div className="group relative aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white/70 dark:border-white/20 dark:bg-slate-900/70">
                      <Image
                        src={g.image_url}
                        alt={g.caption}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                      {g.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 opacity-0 transition group-hover:opacity-100">
                          <p className="text-xs font-semibold text-white">{g.caption}</p>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex aspect-square items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-4 text-center dark:border-white/20 dark:bg-slate-900/70">
                    <div>
                      <div className="text-3xl">📷</div>
                      <div className="mt-2 text-xs font-semibold text-black/60 dark:text-white/60">Gallery coming soon</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </div>
  );
}
