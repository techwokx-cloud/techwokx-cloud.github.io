import Link from "next/link";
import { Globe, Sparkles, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

export default function ScanBar({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`card-dark bg-brand-gradient-radial relative overflow-hidden rounded-2xl border-violet/20 bg-navy-800 ${
        compact ? "p-6" : "p-8"
      }`}
    >
      <div className="relative flex flex-col items-start gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:gap-4 xl:max-w-md">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-violet/30 bg-navy-600">
            <Globe size={24} className="text-violet" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              Ready to discover what AI can do for{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                your website?
              </span>
            </h3>
            <p className="mt-1.5 text-sm text-mist">
              Get your free AI website audit in 60 seconds and see your
              biggest opportunities.
            </p>
          </div>
        </div>

        <Link
          href="/#scan"
          className="btn-gradient focus-ring flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-8 py-4 text-base shadow-glow xl:w-auto"
        >
          <Sparkles size={18} />
          Scan My Website
        </Link>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-mist">
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
  );
}
