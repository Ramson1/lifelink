"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Coordinated looping timeline:
 *   type line1 → type line2 → hold → delete line2 → delete line1 → loop
 *
 * So line1 ("Build Your Future With") always appears first and disappears last,
 * and line2 ("LifeLink Group") appears last and disappears first.
 */
type Phase = "type1" | "type2" | "del2" | "del1";

interface HeroHeadlineProps {
  /** First line, typed before and deleted after `line2`. */
  line1: string;
  /** Second line (rendered with the amber gradient + shine). */
  line2: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  startDelay?: number;
  holdFull?: number;
  holdEmpty?: number;
  /** Short pause between finishing one line and starting the next. */
  interLinePause?: number;
}

export function HeroHeadline({
  line1,
  line2,
  typingSpeed = 90,
  deletingSpeed = 45,
  startDelay = 600,
  holdFull = 2200,
  holdEmpty = 900,
  interLinePause = 400,
}: HeroHeadlineProps) {
  const [n1, setN1] = useState(0);
  const [n2, setN2] = useState(0);
  const [phase, setPhase] = useState<Phase>("type1");
  const [running, setRunning] = useState(false);
  const [staticMode, setStaticMode] = useState(false);
  const reduced = useRef(false);

  // Gate the start, or resolve to static full text for reduced motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const t = setTimeout(
      () => {
        if (mq.matches) {
          setN1(line1.length);
          setN2(line2.length);
          setStaticMode(true);
        } else {
          setRunning(true);
        }
      },
      mq.matches ? 0 : startDelay,
    );
    return () => clearTimeout(t);
  }, [line1, line2, startDelay]);

  // The single state machine that drives both lines in order.
  useEffect(() => {
    if (!running || staticMode) return;
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "type1":
        if (n1 < line1.length) {
          timeout = setTimeout(() => setN1(n1 + 1), typingSpeed);
        } else {
          timeout = setTimeout(() => setPhase("type2"), interLinePause);
        }
        break;
      case "type2":
        if (n2 < line2.length) {
          timeout = setTimeout(() => setN2(n2 + 1), typingSpeed);
        } else {
          timeout = setTimeout(() => setPhase("del2"), holdFull);
        }
        break;
      case "del2":
        if (n2 > 0) {
          timeout = setTimeout(() => setN2(n2 - 1), deletingSpeed);
        } else {
          timeout = setTimeout(() => setPhase("del1"), interLinePause);
        }
        break;
      case "del1":
        if (n1 > 0) {
          timeout = setTimeout(() => setN1(n1 - 1), deletingSpeed);
        } else {
          timeout = setTimeout(() => setPhase("type1"), holdEmpty);
        }
        break;
    }

    return () => clearTimeout(timeout);
  }, [
    running,
    staticMode,
    phase,
    n1,
    n2,
    line1,
    line2,
    typingSpeed,
    deletingSpeed,
    holdFull,
    holdEmpty,
    interLinePause,
  ]);

  const caretOn1 = !staticMode && (phase === "type1" || phase === "del1");
  const caretOn2 = !staticMode && (phase === "type2" || phase === "del2");

  return (
    <h1
      className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6 animate-fade-in-up"
      style={{ animationDelay: "150ms" }}
    >
      <span className="block mb-2" style={{ color: "#ffffff" }}>
        <span className="sr-only">{line1}</span>
        <span aria-hidden="true">
          {line1.slice(0, n1)}
          {caretOn1 && <Caret color="#ffffff" />}
        </span>
      </span>
      <span
        className="block drop-shadow-sm p-2"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #f97316, #eab308, #fb923c)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shine 3s linear infinite",
        }}
      >
        <span className="sr-only">{line2}</span>
        <span aria-hidden="true">
          {line2.slice(0, n2)}
          {caretOn2 && <Caret color="#f59e0b" />}
        </span>
      </span>
    </h1>
  );
}

function Caret({ color }: { color: string }) {
  return (
    <span
      className="ml-1 inline-block w-[3px] rounded-sm animate-caret-blink align-middle"
      style={{ height: "0.95em", backgroundColor: color }}
    />
  );
}
