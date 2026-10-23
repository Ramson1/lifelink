"use client";

import Image from "next/image";

import type { MediaItem } from "@/lib/media-gallery";
import { useMediaViewer } from "./MediaLightboxProvider";

interface MarqueeStripProps {
  items: MediaItem[];
  /** Pause the auto-scroll on hover. */
  pauseOnHover?: boolean;
  /** Tile height utility. */
  tileClassName?: string;
}

/**
 * Full-bleed, endlessly scrolling band of LifeLink photos. Each frame is a
 * clickable thumbnail that opens the shared fullscreen viewer.
 */
export function MarqueeStrip({
  items,
  pauseOnHover = true,
  tileClassName = "h-40 w-56 sm:h-52 sm:w-72",
}: MarqueeStripProps) {
  const { open } = useMediaViewer();
  if (items.length === 0) return null;

  // Duplicate the track so the -50% translate loops seamlessly.
  const track = [...items, ...items];

  return (
    <div className="group/marquee relative overflow-hidden">
      <div
        className={`flex w-max gap-4 animate-scroll-left ${
          pauseOnHover ? "group-hover/marquee:[animation-play-state:paused]" : ""
        }`}
      >
        {track.map((m, i) => (
          <button
            key={`${m.src}-${i}`}
            type="button"
            onClick={() => open(items, i % items.length)}
            aria-label={`View ${m.caption}`}
            className={`group/tile relative ${tileClassName} flex-none overflow-hidden rounded-2xl border border-black/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/70 dark:border-white/15 dark:bg-slate-900/70`}
          >
            {m.type === "video" ? (
              <video
                src={m.src}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={m.src}
                alt={m.caption}
                fill
                sizes="288px"
                className="object-cover"
              />
            )}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent p-2 pt-6 text-left text-[11px] font-semibold text-white transition-transform duration-300 group-hover/tile:translate-y-0">
              {m.caption}
            </span>
          </button>
        ))}
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-slate-950 sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-slate-950 sm:w-28" />
    </div>
  );
}
