"use client";

import { useState } from "react";
import { Globe, Sparkles, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

export default function ScanBar({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");

  return (
    <div
      id="scan"
      className={`card-dark bg-brand-gradient-radial relative overflow-hidden rounded-2xl border-violet/20 bg-navy-800 ${
        compact ? "p-6" : "p-8"
      }`}
    >
      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-violet/30 bg-navy-600">
            <Globe size={24} className="text-violet" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              Ready to discover what AI can do for{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                your website?
              </span>
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-mist">
              Get your free AI website audit in 60 seconds and see your
              biggest opportunities.
            </p>
          </div>
        </div>

        <form
          className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="sr-only" htmlFor="scan-url">
            Website URL
          </label>
          <input
            id="scan-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your website URL"
            className="focus-ring w-full rounded-xl border border-white/10 bg-navy-700 px-4 py-3.5 text-sm text-white placeholder:text-mist sm:w-72"
          />
          <button
            type="submit"
            className="btn-gradient focus-ring flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3.5 text-sm"
          >
            <Sparkles size={16} />
            Scan My Website
          </button>
        </form>
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
