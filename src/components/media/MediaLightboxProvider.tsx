"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { MediaItem } from "@/lib/media-gallery";

type OpenViewer = (items: MediaItem[], index?: number) => void;

interface MediaViewerContextValue {
  open: OpenViewer;
}

const MediaViewerContext = createContext<MediaViewerContextValue | null>(null);

/** Access the shared fullscreen media viewer from any client component. */
export function useMediaViewer(): MediaViewerContextValue {
  const ctx = useContext(MediaViewerContext);
  if (!ctx) {
    throw new Error("useMediaViewer must be used within <MediaLightboxProvider>");
  }
  return ctx;
}

export function MediaLightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [index, setIndex] = useState(0);

  const open = useCallback<OpenViewer>((nextItems, i = 0) => {
    if (nextItems.length === 0) return;
    setItems(nextItems);
    setIndex(((i % nextItems.length) + nextItems.length) % nextItems.length);
  }, []);

  const close = useCallback(() => setItems([]), []);

  const count = items.length;
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count],
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  const value = useMemo(() => ({ open }), [open]);

  // Keyboard navigation + background scroll lock while the viewer is open.
  useEffect(() => {
    if (count === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [count, close, prev, next]);

  const current = items[index];
  const hasMultiple = count > 1;

  // The viewer is only ever shown after a client-side click sets `items`, so
  // `document` is guaranteed to exist here (never during SSR).
  const viewer =
    current
      ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={current.caption || "Media viewer"}
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm animate-fade-in-up"
          >
            {/* Top bar: counter + close */}
            <div className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
              <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                <span className="tabular-nums">
                  {index + 1} / {count}
                </span>
                {current.category && current.category !== "general" && (
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/90">
                    {current.category}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Exit full screen"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Exit full screen</span>
              </button>
            </div>

            {/* Media stage (click empty area to close) */}
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
              className="relative z-10 flex flex-1 items-center justify-center px-4 pb-4 sm:px-20"
            >
              {hasMultiple && (
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60 sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <div className="relative flex h-full max-h-full w-full max-w-6xl items-center justify-center">
                {current.type === "video" ? (
                  <video
                    key={current.src}
                    src={current.src}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[78vh] w-auto max-w-full rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="relative flex h-[78vh] max-h-[78vh] w-full items-center justify-center">
                    <Image
                      src={current.src}
                      alt={current.caption}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      style={{ objectFit: "contain" }}
                      priority
                    />
                  </div>
                )}
              </div>

              {hasMultiple && (
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/60 sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Caption */}
            {current.caption && (
              <div className="relative z-10 px-5 pb-6 text-center sm:px-8">
                <p className="mx-auto max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                  {current.caption}
                </p>
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <MediaViewerContext.Provider value={value}>
      {children}
      {viewer}
    </MediaViewerContext.Provider>
  );
}
