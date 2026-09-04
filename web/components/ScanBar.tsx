import Link from "next/link";
import { Globe, Sparkles, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function ScanBar({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`card-dark bg-brand-gradient-radial relative overflow-hidden rounded-2xl border-violet/20 bg-navy-800 ${
        compact ? "p-8" : "p-10"
      }`}
    >
      <Reveal variant="scale">
        <div className="relative flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet/30 bg-navy-600">
            <Globe size={28} className="text-violet" />
          </div>
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to discover what AI can do for{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                your website?
              </span>
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-base text-mist">
              Get your free AI website audit in 60 seconds and see your
              biggest opportunities.
            </p>
          </div>

          <Link
            href="/#scan"
            className="btn-gradient focus-ring flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-10 py-4 text-base shadow-glow"
          >
            <Sparkles size={18} />
            Scan My Website
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-mist">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-violet" /> 100% Free
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-violet" /> 60-Second Audit
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-violet" /> No Credit Card
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
