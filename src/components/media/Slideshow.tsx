"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2 } from "lucide-react";

import type { MediaItem } from "@/lib/media-gallery";
import { useMediaViewer } from "./MediaLightboxProvider";

interface SlideshowProps {
  items: MediaItem[];
  /** Milliseconds each slide is shown before auto-advancing. */
  intervalMs?: number;
  className?: string;
}

/**
 * Auto-advancing Ken Burns slideshow of LifeLink media. Pauses on hover,
 * supports manual navigation, and opens the fullscreen viewer on demand.
 */
export function Slideshow({
  items,
  intervalMs = 5000,
  className = "",
}: SlideshowProps) {
  const { open } = useMediaViewer();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const count = items.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!playing || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [playing, count, intervalMs]);

  if (count === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-black/10 bg-slate-900 shadow-xl dark:border-white/20 ${className}`}
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
    >
      <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[600px]">
        {items.map((m, i) => {
          const active = i === index;
          return (
            <div
              key={`${m.src}-${i}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              {m.type === "video" ? (
                <video
                  src={m.src}
                  className="h-full w-full object-cover"
                  autoPlay={active}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={m.src}
                  alt={m.caption}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  className={`object-cover ${active ? "animate-ken-burns" : ""}`}
                />
              )}
            </div>
          );
        })}

        {/* Readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Click to open fullscreen viewer */}
        <button
          type="button"
          onClick={() => open(items, index)}
          aria-label="View slideshow full screen"
          className="absolute inset-0 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50"
        />

        {/* Caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
          <p className="max-w-2xl text-lg font-semibold text-white drop-shadow sm:text-2xl">
            {items[index].caption}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/70">
            {items[index].category} · {index + 1} / {count}
          </p>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="rounded-full border border-white/25 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="rounded-full border border-white/25 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="rounded-full border border-white/25 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => open(items, index)}
            aria-label="Open in full screen"
            className="ml-1 hidden rounded-full border border-white/25 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60 sm:inline-flex"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      {count > 1 && (
        <div className="absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-2">
          {items.map((m, i) => (
            <button
              key={`dot-${m.src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
