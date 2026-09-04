"use client";

import { useState } from "react";
import { Globe, Sparkles, CheckCircle2, Clock, ShieldCheck, Check, Mail } from "lucide-react";

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function HeroScanBar() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setUrl((v) => normalizeUrl(v));
    if (!showEmail) {
      setShowEmail(true);
      return;
    }
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="card-dark relative overflow-hidden rounded-2xl border-violet/30 bg-navy-800 p-6 shadow-glow sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          See Your AI Opportunity in{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">
            60 Seconds
          </span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-mist sm:text-base">
          Enter your website and we&apos;ll show you where AI can create the
          biggest impact for your business — a scored report with clear next
          steps, sent straight to your inbox.
        </p>
      </div>

      {submitted ? (
        <div className="mx-auto mt-6 flex max-w-lg items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-300">
          <Check size={16} className="shrink-0" />
          Thanks! The AI Website Scanner is almost ready — we&apos;ll email
          your report to {email} the moment it&apos;s live.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-lg">
          {!showEmail ? (
            <div className="flex flex-col gap-3 rounded-xl bg-white p-1.5 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3 py-2.5">
                <Globe size={18} className="shrink-0 text-slate-400" />
                <input
                  type="text"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={() => setUrl((v) => normalizeUrl(v))}
                  placeholder="Enter your website URL"
                  className="w-full min-w-0 bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-gradient focus-ring flex shrink-0 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm"
              >
                Scan My Website
                <span aria-hidden>→</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl bg-white p-1.5 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 px-3 py-2.5">
                <Mail size={18} className="shrink-0 text-slate-400" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Where should we send your report?"
                  className="w-full min-w-0 bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-gradient focus-ring flex shrink-0 items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm"
              >
                Get My Report
                <span aria-hidden>→</span>
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-mist">
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
        </form>
      )}
    </div>
  );
}
