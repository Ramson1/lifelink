"use client";

import Image from "next/image";
import { Play } from "lucide-react";

import type { MediaItem } from "@/lib/media-gallery";
import { useMediaViewer } from "./MediaLightboxProvider";

interface MediaGalleryProps {
  items: MediaItem[];
  /** Tailwind grid classes for the container. */
  gridClassName?: string;
  /** Aspect utility applied to each tile. */
  tileClassName?: string;
}

/**
 * Responsive media grid. Every tile opens the shared fullscreen viewer,
 * so visitors can browse the whole set with prev/next and media controls.
 */
export function MediaGallery({
  items,
  gridClassName = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
  tileClassName = "aspect-square",
}: MediaGalleryProps) {
  const { open } = useMediaViewer();

  if (items.length === 0) return null;

  return (
    <div className={gridClassName}>
      {items.map((m, i) => (
        <button
          key={`${m.src}-${i}`}
          type="button"
          onClick={() => open(items, i)}
          aria-label={`View ${m.type === "video" ? "video" : "photo"}: ${m.caption}`}
          className={`group relative ${tileClassName} overflow-hidden rounded-3xl border border-black/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 dark:border-white/20 dark:bg-slate-900/70`}
        >
          {m.type === "video" ? (
            <>
              <video
                src={m.src}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition group-hover:scale-110 group-hover:bg-black/70">
                  <Play className="h-5 w-5 translate-x-0.5 fill-current" />
                </span>
              </span>
              <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                ▶ Video
              </span>
            </>
          ) : (
            <Image
              src={m.src}
              alt={m.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          )}

          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-left text-xs font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
            {m.caption}
          </span>
          <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
            ⤢ Full screen
          </span>
        </button>
      ))}
    </div>
  );
}
