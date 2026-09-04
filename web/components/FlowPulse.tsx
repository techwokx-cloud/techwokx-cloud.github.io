"use client";

import type { LucideIcon } from "lucide-react";

export default function FlowPulse({
  steps,
  accent = "violet",
  speed = 2.4,
}: {
  steps: { icon: LucideIcon; label: string }[];
  accent?: "violet" | "mist";
  speed?: number;
}) {
  const dotColor = accent === "violet" ? "bg-violet" : "bg-mist";

  return (
    <div className="relative flex items-start justify-between">
      {/* Track line with a traveling pulse */}
      <div
        className="absolute left-[10%] right-[10%] top-4 h-px overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <span
          className={`absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${dotColor} shadow-glow animate-flow-travel`}
          style={{ animationDuration: `${speed}s` }}
        />
      </div>
      {steps.map((s) => (
        <div key={s.label} className="relative z-10 flex flex-1 flex-col items-center gap-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-white/70">
            <s.icon size={14} />
          </span>
          <span className="text-center text-[10px] leading-tight text-mist">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
