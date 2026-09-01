"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

const LERP_FACTOR = 0.08;
const DOT_SPACING = 34; // px between dots
const DOT_RADIUS = 4; // px radius of each dot
const BLOB_SIZE = 500; // px diameter of the circular area

function dotPattern(color: string) {
  return `radial-gradient(circle, ${color} ${DOT_RADIUS}px, transparent ${DOT_RADIUS}px)`;
}

const SOFT_MASK =
  "radial-gradient(circle, black 40%, transparent 75%)";

export function CursorGradient() {
  const { theme } = useTheme();
  const blobRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(-500);
  const targetY = useRef(-500);
  const currentX = useRef(-500);
  const currentY = useRef(-500);
  const rafId = useRef(0);
  const isVisible = useRef(false);

  // Update dot color when theme changes
  useEffect(() => {
    if (blobRef.current) {
      const color = theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.13)";
      blobRef.current.style.backgroundImage = dotPattern(color);
    }
  }, [theme]);

  useEffect(() => {
    // Respect reduced-motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const half = BLOB_SIZE / 2;

    const animate = () => {
      currentX.current = lerp(currentX.current, targetX.current, LERP_FACTOR);
      currentY.current = lerp(currentY.current, targetY.current, LERP_FACTOR);

      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${currentX.current - half}px, ${currentY.current - half}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const showBlob = () => {
      if (!isVisible.current && blobRef.current) {
        blobRef.current.style.opacity = "1";
        isVisible.current = true;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      showBlob();
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        targetX.current = t.clientX;
        targetY.current = t.clientY;
        showBlob();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        targetX.current = t.clientX;
        targetY.current = t.clientY;
        showBlob();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId.current);
      } else {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    // Initialize position
    targetX.current = window.innerWidth / 2;
    targetY.current = window.innerHeight / 2;
    currentX.current = targetX.current;
    currentY.current = targetY.current;

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    // Attach listeners (all passive for scroll performance)
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 rounded-full opacity-0 transition-opacity duration-1000"
      style={{
        width: BLOB_SIZE,
        height: BLOB_SIZE,
        backgroundImage: dotPattern("rgba(0,0,0,0.25)"),
        backgroundSize: `${DOT_SPACING}px ${DOT_SPACING}px`,
        maskImage: SOFT_MASK,
        WebkitMaskImage: SOFT_MASK,
        willChange: "transform",
      }}
    />
  );
}
