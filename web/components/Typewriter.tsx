"use client";

import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  speed = 45,
  pauseMs = 2200,
  className = "",
}: {
  text: string;
  speed?: number;
  pauseMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    if (phase === "typing") {
      if (display.length < text.length) {
        const t = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), speed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pausing"), pauseMs);
      return () => clearTimeout(t);
    }
    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 400);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(text.slice(0, display.length - 1)), speed / 2);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("typing"), 500);
      return () => clearTimeout(t);
    }
  }, [display, phase, text, speed, pauseMs]);

  return (
    <span className={className}>
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}
