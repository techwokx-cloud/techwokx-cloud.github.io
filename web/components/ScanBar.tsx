"use client";

import { useState } from "react";
import { Globe, Sparkles, CheckCircle2, Clock, ShieldCheck, Check } from "lucide-react";

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function ScanBar({ compact = false }: { compact?: boolean }) {
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setUrl(normalizeUrl(url));
    setSubmitted(true);
  };

  return (
    <div
      id="scan"
      className={`card-dark bg-brand-gradient-radial relative overflow-hidden rounded-2xl border-violet/20 bg-navy-800 ${
        compact ? "p-6" : "p-8"
      }`}
    >
      <div className="relative flex flex-col items-start gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4 xl:max-w-md">
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

        {submitted ? (
          <div className="flex w-full items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-300 xl:w-auto xl:min-w-[380px]">
            <Check size={16} className="shrink-0" />
            Thanks! The AI Website Scanner is almost ready — we&apos;ll notify
            you the moment it&apos;s live.
          </div>
        ) : (
          <form
            className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="scan-url">
              Website URL
            </label>
            <input
              id="scan-url"
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setUrl((v) => normalizeUrl(v))}
              placeholder="Enter your website URL"
              className="focus-ring w-full min-w-0 rounded-xl border border-white/10 bg-navy-700 px-4 py-3.5 text-sm text-white placeholder:text-mist sm:flex-1 xl:w-72 xl:flex-none"
            />
            <button
              type="submit"
              className="btn-gradient focus-ring flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3.5 text-sm"
            >
              <Sparkles size={16} />
              Scan My Website
            </button>
          </form>
        )}
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

