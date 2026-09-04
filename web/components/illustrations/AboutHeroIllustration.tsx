import { Brain, MessageCircle, Star, Zap, Sparkles, Layout } from "lucide-react";

const badges = [
  { icon: Brain, label: "AI Understands", top: "10%" },
  { icon: MessageCircle, label: "AI Engages", top: "36%" },
  { icon: Star, label: "AI Recommends", top: "62%" },
  { icon: Zap, label: "AI Takes Action", top: "88%" },
];

export default function AboutHeroIllustration() {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-xl sm:h-[300px]">
      {/* Flowing circuit lines: browser -> portal -> each badge */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="about-circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#about-circuit-grad)" strokeWidth="0.5" opacity="0.85">
          <path className="animate-circuit-flow" d="M 30 50 L 55 50" />
          {badges.map((b, i) => (
            <path
              key={b.label}
              className="animate-circuit-flow"
              style={{ animationDelay: `${i * 0.4}s` }}
              d={`M 62 50 C 75 50, 78 ${b.top.replace("%", "")}, 88 ${b.top.replace("%", "")}`}
            />
          ))}
        </g>
      </svg>

      {/* Browser mockup */}
      <div className="absolute left-0 top-1/2 w-36 -translate-y-1/2 sm:w-40">
        <p className="mb-2 text-center text-[10px] font-medium text-mist">
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

      {/* Portal */}
      <div
        className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient shadow-glow"
        style={{ left: "58%", top: "50%" }}
      >
        <div className="absolute inset-0 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-md" />
        <Sparkles size={26} className="relative text-white" />
        <span className="absolute -bottom-7 whitespace-nowrap text-center text-[10px] font-semibold uppercase tracking-wide text-violet">
          TechWokx AI Layer
        </span>
      </div>

      {/* Capability badges */}
      {badges.map((b, i) => (
        <div
          key={b.label}
          className="card-dark absolute right-0 flex -translate-y-1/2 items-center gap-2 rounded-full py-1.5 pl-2 pr-3.5 animate-chip-float"
          style={{ top: b.top, animationDelay: `${i * 250}ms` }}
        >
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-600 animate-icon-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <b.icon size={13} className="text-violet" />
          </span>
          <span className="whitespace-nowrap text-[11px] font-medium text-white/85">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
