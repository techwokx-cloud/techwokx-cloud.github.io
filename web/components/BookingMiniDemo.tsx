"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Check } from "lucide-react";

export default function BookingMiniDemo() {
  const [stage, setStage] = useState<"idle" | "clicking" | "booked">("idle");

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    const run = () => {
      setStage("idle");
      t1 = setTimeout(() => setStage("clicking"), 1400);
      t2 = setTimeout(() => setStage("booked"), 1900);
    };
    run();
    const interval = setInterval(run, 4200);
    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="card-dark w-56 rounded-2xl p-3.5">
      <p className="flex items-center gap-1.5 text-xs text-white/80">
        <CalendarCheck size={13} className="text-orange-400" /> AI Booking
      </p>
      <div className="relative mt-2.5 flex items-center justify-between overflow-hidden rounded-lg bg-navy-700 px-2.5 py-2">
        <span className="text-[11px] text-mist">Tue, 10:00 AM</span>
        <span
          className={`relative flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-300 ${
            stage === "booked"
              ? "border-emerald-500 bg-emerald-500"
              : "border-white/30"
          }`}
        >
          {stage === "booked" && <Check size={10} className="text-white" />}
        </span>
        <span
          className={`pointer-events-none absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-white shadow-glow transition-all duration-500 ${
            stage === "clicking"
              ? "scale-100 opacity-100"
              : stage === "booked"
              ? "scale-0 opacity-0"
              : "translate-x-6 scale-0 opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
