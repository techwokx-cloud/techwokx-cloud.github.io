"use client";

import { ArrowRight } from "lucide-react";
import Typewriter from "@/components/Typewriter";

export default function IndustryChatWidget({
  label,
  labelColor,
  greeting,
  prompts,
  accent,
}: {
  label: string;
  labelColor: string;
  greeting: string;
  prompts: string[];
  accent: string;
}) {
  return (
    <div className="w-44 overflow-hidden rounded-xl bg-white shadow-lg sm:w-48">
      <div className={`px-3 py-2 text-xs font-semibold text-white ${labelColor}`}>
        {label}
      </div>
      <div className="space-y-2 p-3">
        <p className="min-h-[32px] text-[11px] leading-snug text-slate-700">
          <Typewriter text={greeting} speed={30} pauseMs={2600} />
        </p>
        <div className="space-y-1.5">
          {prompts.map((p, i) => (
            <div
              key={p}
              className="animate-badge-fade rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-600"
              style={{ animationDelay: `${800 + i * 250}ms` }}
            >
              {p}
            </div>
          ))}
        </div>
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${accent}`}>
          <ArrowRight size={12} className="text-white" />
        </div>
      </div>
    </div>
  );
}
