"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** "up" (default) fades and slides up; "scale" fades and scales in — nicer for images. */
  variant?: "up" | "scale";
  /** Render as a span instead of a div, for use inside inline contexts like <h1>/<p>. */
  as?: "div" | "span";
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden =
    variant === "scale"
      ? "opacity-0 scale-75"
      : "opacity-0 translate-y-16";
  const shown = "opacity-100 scale-100 translate-y-0";

  const Tag = as;
  const display = as === "span" ? "inline-block" : "block";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLSpanElement>}
      className={`${display} transition-all ease-out ${visible ? shown : hidden} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: "900ms",
        transitionTimingFunction: visible
          ? "cubic-bezier(0.22, 1.4, 0.36, 1)"
          : undefined,
      }}
    >
      {children}
    </Tag>
  );
}
