"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, CheckCircle2, Clock, ShieldCheck, Check } from "lucide-react";

const countryCodes = [
  { code: "+233", label: "🇬🇭 +233" },
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+254", label: "🇰🇪 +254" },
  { code: "+27", label: "🇿🇦 +27" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+other", label: "🌍 Other" },
];

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function HeroScanBar() {
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+233");
  const [whatsapp, setWhatsapp] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setUrl((v) => normalizeUrl(v));
    setShowDetails(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !businessName.trim()) return;
    setSubmitted(true);
  };

  // Click outside the expanded details step collapses it back to step 1.
  useEffect(() => {
    if (!showDetails || submitted) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setShowDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDetails, submitted]);

  return (
    <div
      ref={rootRef}
      className="card-dark relative overflow-hidden rounded-2xl border-violet/30 bg-navy-800 p-6 shadow-glow sm:p-8"
    >
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
          Thanks, {businessName}! The AI Website Scanner is almost ready —
          we&apos;ll email your report to {email}
          {whatsapp && ` and follow up on WhatsApp (${countryCode} ${whatsapp})`} the
          moment it&apos;s live.
        </div>
      ) : !showDetails ? (
        <form onSubmit={handleUrlSubmit} className="mx-auto mt-6 max-w-lg">
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
      ) : (
        <form
          onSubmit={handleDetailsSubmit}
          className="mx-auto mt-6 max-w-lg space-y-3"
        >
          <p className="text-center text-xs text-mist">
            Almost there — where should we send the report for{" "}
            <span className="text-white">{url}</span>?
          </p>

          <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5">
            <img src="/icons/building-icon.png" alt="" className="h-[18px] w-[18px] shrink-0 opacity-70" />
            <input
              type="text"
              required
              autoFocus
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business name"
              className="w-full min-w-0 bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5">
            <img src="/icons/mail-icon.png" alt="" className="h-[18px] w-[18px] shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Business email"
              className="w-full min-w-0 bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white px-2 py-2.5 sm:px-3">
            <img src="/icons/whatsapp-icon.png" alt="" className="h-[18px] w-[18px] shrink-0" />
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              aria-label="Country code"
              className="shrink-0 bg-transparent text-sm text-navy focus:outline-none"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/[^\d\s-]/g, ""))}
              placeholder="WhatsApp number (optional)"
              className="w-full min-w-0 bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="btn-gradient focus-ring flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm"
          >
            Get My Report
            <span aria-hidden>→</span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-xs text-mist">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-violet" /> 100% Free
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
