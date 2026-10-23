import Image from "next/image";

import { Container } from "@/components/Container";
import { MeshGradient } from "@/components/MeshGradient";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MediaGallery } from "@/components/media/MediaGallery";
import type { MediaItem } from "@/lib/media-gallery";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Events & Certificates",
  description:
    "View LifeLink Group's events, certificates, and media gallery showcasing our milestones and achievements.",
  path: "/events",
});

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
  media_type: "image" | "video";
  caption: string;
  category: string;
}

/** Shown when the database has no certificates yet (e.g. before migration 0008 is run). */
const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: "cac-incorporation",
    title: "CAC Certificate of Incorporation",
    subtitle: "Company Registration No. 9508709 \u2014 Federal Republic of Nigeria",
    image_url: "/certificates/cac-certificate-of-incorporation.jpg",
    icon_emoji: "\ud83c\udfdb\ufe0f",
  },
];

/** Shown when the database has no gallery media yet (e.g. before migration 0009 is run). */
const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "g01", image_url: "/gallery/gallery-01.jpg", media_type: "image", caption: "Members in plenary at a LifeLink empowerment session", category: "events" },
  { id: "g03", image_url: "/gallery/gallery-03.jpg", media_type: "image", caption: "Group photo of LifeLink participants outside the venue", category: "community" },
  { id: "g04", image_url: "/gallery/gallery-04.jpg", media_type: "image", caption: "LifeLink team in branded apparel at a company event", category: "events" },
  { id: "v01", image_url: "/gallery/gallery-video-01.mp4", media_type: "video", caption: "Highlights from a LifeLink group event", category: "events" },
  { id: "g08", image_url: "/gallery/gallery-08.jpg", media_type: "image", caption: "Welcoming guests at a LifeLink event", category: "community" },
  { id: "g13", image_url: "/gallery/gallery-13.jpg", media_type: "image", caption: "Group photo with LifeLink leadership", category: "partnerships" },
  { id: "g16", image_url: "/gallery/gallery-16.jpg", media_type: "image", caption: "LifeLink members in traditional attire at an event", category: "community" },
  { id: "g18", image_url: "/gallery/gallery-18.jpg", media_type: "image", caption: "A speaker addressing the LifeLink audience", category: "training" },
  { id: "v04", image_url: "/gallery/gallery-video-04.mp4", media_type: "video", caption: "Celebration and fellowship at LifeLink", category: "events" },
  { id: "g23", image_url: "/gallery/gallery-23.jpg", media_type: "image", caption: "LifeLink members enjoying a shared meal", category: "community" },
  { id: "g29", image_url: "/gallery/gallery-29.jpg", media_type: "image", caption: "Group photo celebrating LifeLink togetherness", category: "community" },
  { id: "g40", image_url: "/gallery/gallery-40.jpg", media_type: "image", caption: "Leading worship and prayer at a LifeLink gathering", category: "community" },
];

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
  const certs = certificates.length > 0 ? certificates : DEFAULT_CERTIFICATES;
  const galleryItems = gallery.length > 0 ? gallery : DEFAULT_GALLERY;
  const galleryMedia: MediaItem[] = galleryItems.map((g) => ({
    src: g.image_url,
    type: g.media_type,
    caption: g.caption,
    category: g.category,
  }));

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
            {certs.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certs.map((cert, i) => (
                  <ScrollReveal key={cert.id} delay={i * 80}>
                    <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-black/10 bg-white/70 p-6 text-center overflow-hidden dark:border-white/20 dark:bg-slate-900/70">
                      {cert.image_url ? (
                        <a
                          href={cert.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${cert.title} full size`}
                          className="group/cert relative block h-full w-full overflow-hidden"
                        >
                          <Image
                            src={cert.image_url}
                            alt={cert.title}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-contain p-2 transition-transform duration-500 group-hover/cert:scale-[1.03]"
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-center text-xs font-semibold text-white transition-transform duration-300 group-hover/cert:translate-y-0">
                            Click to view full size
                          </div>
                        </a>
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
            {galleryMedia.length > 0 ? (
              <div className="mt-6">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-black/50 dark:text-white/50">
                  Tap any photo or video to view it full screen with controls
                </p>
                <MediaGallery items={galleryMedia} />
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
