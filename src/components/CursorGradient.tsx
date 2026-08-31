"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

const LERP_FACTOR = 0.08;

const LIGHT_GRADIENT =
  "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(6,182,212,0.12) 35%, rgba(139,92,246,0.10) 55%, transparent 75%)";

const DARK_GRADIENT =
  "radial-gradient(circle, rgba(129,140,248,0.22) 0%, rgba(34,211,238,0.16) 35%, rgba(167,139,250,0.14) 55%, transparent 75%)";

export function CursorGradient() {
  const { theme } = useTheme();
  const blobRef = useRef<HTMLDivElement>(null);
  const targetX = useRef(-500);
  const targetY = useRef(-500);
  const currentX = useRef(-500);
  const currentY = useRef(-500);
  const rafId = useRef(0);
  const isVisible = useRef(false);

  // Update gradient when theme changes
  useEffect(() => {
    if (blobRef.current) {
      blobRef.current.style.background = theme === "dark" ? DARK_GRADIENT : LIGHT_GRADIENT;
    }
  }, [theme]);

  useEffect(() => {
    // Respect reduced-motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      currentX.current = lerp(currentX.current, targetX.current, LERP_FACTOR);
      currentY.current = lerp(currentY.current, targetY.current, LERP_FACTOR);

      if (blobRef.current) {
        // Center the 800×500 ellipse on the cursor position
        blobRef.current.style.transform = `translate3d(${currentX.current - 400}px, ${currentY.current - 250}px, 0)`;
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
      className="pointer-events-none fixed left-0 top-0 z-0 h-[500px] w-[800px] rounded-full opacity-0 transition-opacity duration-1000"
      style={{
        background: LIGHT_GRADIENT,
        filter: "blur(80px)",
        willChange: "transform",
      }}
    />
  );
}
