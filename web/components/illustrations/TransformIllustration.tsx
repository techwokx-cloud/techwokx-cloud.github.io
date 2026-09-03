import { Brain, MessageCircle, Star, Zap, Sparkles, Layout } from "lucide-react";

const badges = [
  { icon: Brain, label: "AI Understands" },
  { icon: MessageCircle, label: "AI Engages" },
  { icon: Star, label: "AI Recommends" },
  { icon: Zap, label: "AI Takes Action" },
];

export default function TransformIllustration() {
  return (
    <div className="relative flex items-center justify-center gap-2 py-6 sm:gap-4">
      {/* Your existing website */}
      <div className="w-40 shrink-0 sm:w-48">
        <p className="mb-2 text-center text-[11px] font-medium text-mist">
          Your Existing Website
        </p>
        <div className="card-dark rounded-xl p-3">
          <div className="mb-2.5 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400/70" />
            <span className="h-2 w-2 rounded-full bg-amber-400/70" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-white/15" />
            <div className="h-2 w-1/2 rounded-full bg-white/10" />
            <div className="mt-2 flex h-12 items-center justify-center rounded-lg bg-white/5">
              <Layout size={18} className="text-white/30" />
            </div>
            <div className="h-2 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Connector + portal */}
      <div className="flex flex-col items-center gap-1.5">
        <svg width="56" height="2" className="hidden text-violet/40 sm:block">
          <line x1="0" y1="1" x2="56" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-gradient shadow-glow sm:h-20 sm:w-20">
          <div className="absolute inset-0 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-md" />
          <Sparkles size={26} className="relative text-white" />
        </div>
        <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-violet">
          TechWokx
          <br />
          AI Layer
        </span>
        <svg width="56" height="2" className="hidden text-blue-400/40 sm:block">
          <line x1="0" y1="1" x2="56" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* Capability badges */}
      <div className="flex flex-col gap-2">
        {badges.map((b) => (
          <div
            key={b.label}
            className="card-dark flex items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-600">
              <b.icon size={13} className="text-violet" />
            </span>
            <span className="whitespace-nowrap text-[11px] font-medium text-white/85">
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
