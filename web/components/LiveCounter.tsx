"use client";

import { useEffect, useRef, useState } from "react";

export default function LiveCounter({
  value,
  suffix = "",
  tickEvery = 4500,
  tickAmount = 1,
}: {
  value: number;
  suffix?: string;
  tickEvery?: number;
  tickAmount?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initial count-up animation.
  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value]);

  // Periodic "live" ticks upward, looping, so it never feels static.
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setDisplay((d) => d + tickAmount);
    }, tickEvery);
    return () => clearInterval(interval);
  }, [visible, tickEvery, tickAmount]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
