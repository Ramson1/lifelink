"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Sparkles } from "lucide-react";

import { Container } from "@/components/Container";

/**
 * LifeLink 2026 AGM / 6th Anniversary countdown.
 * Campaign window: 17 Oct – 1 Dec 2026 (West Africa Time).
 * Countdown target: 6 December 2026, 00:00 WAT (AGM / Anniversary day).
 */
const EVENT_START = new Date("2026-10-17T00:00:00+01:00");
const EVENT_TARGET = new Date("2026-12-06T00:00:00+01:00");
const WINDOW_MS = EVENT_TARGET.getTime() - EVENT_START.getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(): TimeLeft {
  const total = EVENT_TARGET.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor(total / 3_600_000) % 24,
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1_000) % 60,
    total,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

const GOLD_TEXT: React.CSSProperties = {
  background: "linear-gradient(135deg, #fbbf24, #f59e0b, #fde68a)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export function CountdownTimer() {
  // Null until mounted — keeps the server render and first client render
  // identical (no hydration mismatch), then ticks live on the client.
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // setState only inside callbacks (react-hooks/set-state-in-effect).
    const initial = setTimeout(() => setTime(getTimeLeft()), 0);
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, []);

  const arrived = time !== null && time.total <= 0;
  const progress = time
    ? Math.min(100, Math.max(0, ((WINDOW_MS - time.total) / WINDOW_MS) * 100))
    : 0;

  const units = [
    { label: "Days", value: time ? pad(time.days) : "\u2013" },
    { label: "Hours", value: time ? pad(time.hours) : "\u2013" },
    { label: "Minutes", value: time ? pad(time.minutes) : "\u2013" },
    { label: "Seconds", value: time ? pad(time.seconds) : "\u2013" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-950 py-16 text-white sm:py-20">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />

      <Container className="relative">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="glass-panel inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            LifeLink 2026 AGM / 6th Anniversary
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "#ffffff" }}>
            Countdown to <span style={GOLD_TEXT}>6th December 2026</span>
          </h2>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.25em] text-white/70 sm:text-base">
            17th October &ndash; 1st December 2026 &middot; Support the History
          </p>
        </div>

        {/* Timer cards / arrived state */}
        {arrived ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-amber-300/40 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm">
            <div className="text-4xl font-extrabold sm:text-5xl" style={GOLD_TEXT}>
              It&apos;s Happening Now!
            </div>
            <p className="mt-3 text-base leading-7 text-white/80">
              The LifeLink 2026 AGM &amp; 6th Anniversary is here. Thank you for being part of the history.
            </p>
          </div>
        ) : (
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
            {units.map((u) => (
              <div
                key={u.label}
                className="rounded-2xl border border-white/15 bg-white/5 px-3 py-6 text-center shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl font-extrabold tabular-nums sm:text-5xl" style={GOLD_TEXT}>
                  {u.value}
                </div>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                  {u.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campaign progress */}
        {!arrived && (
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/60">
              <span>17 Oct 2026 &middot; Countdown starts</span>
              <span>6 Dec 2026 &middot; AGM Day</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress.toFixed(2)}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <Link
            href="/register"
            className="btn-shine w-full rounded-full px-8 py-3.5 text-center text-base font-bold text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:scale-105 sm:w-auto"
          >
            Become a Member
          </Link>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/75">
            <CalendarDays className="h-4 w-4 text-amber-300" />
            6 December 2026 &middot; LifeLink 2026 AGM / 6th Anniversary
          </span>
        </div>
      </Container>
    </section>
  );
}
