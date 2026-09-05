"use client";

import { useEffect, useRef, useState } from "react";
import {
  Globe,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Check,
  Loader2,
  AlertTriangle,
  RotateCcw,
  Package,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import AnimatedScoreRing from "@/components/AnimatedScoreRing";

const countryCodes = [
  { code: "+233", label: "🇬🇭 +233" },
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+254", label: "🇰🇪 +254" },
  { code: "+27", label: "🇿🇦 +27" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+other", label: "🌍 Other" },
];

const LEVEL_COLOR: Record<string, string> = {
  HIGH: "text-emerald-400",
  MEDIUM: "text-amber-400",
  LOW: "text-slate-400",
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

type ScanReport = {
  url: string;
  readinessScore: number;
  opportunities: { area: string; level: string; reason: string }[];
  businessCase?: {
    summary: string;
    recommendedPackage: { name: string; price: string; period: string };
    estimatedTimeline: string;
    projectedOutcomes: string[];
    courseOfAction: string[];
  };
};

type Step = "url" | "loading" | "error" | "results" | "details" | "submitted";

export default function HeroScanBar() {
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+233");
  const [whatsapp, setWhatsapp] = useState("");
  const [step, setStep] = useState<Step>("url");
  const [report, setReport] = useState<ScanReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const runScan = async (targetUrl: string) => {
    setStep("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${siteConfig.apiBaseUrl}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong scanning that website.");
      }
      setReport(data);
      setStep("results");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Couldn't reach the scanner. Please try again."
      );
      setStep("error");
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    const normalized = normalizeUrl(url);
    setUrl(normalized);
    runScan(normalized);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !businessName.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`${siteConfig.apiBaseUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          email,
          whatsappCountryCode: countryCode,
          whatsappNumber: whatsapp,
          sourceUrl: url,
        }),
      });
    } catch {
      // Non-fatal — still show the confirmation; worst case the lead isn't
      // saved server-side and we'd only notice via lower campaign volume.
    } finally {
      setSubmitting(false);
      setStep("submitted");
    }
  };

  // Click outside the expanded details step collapses it back to results.
  useEffect(() => {
    if (step !== "details") return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setStep("results");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [step]);

  // Auto-reset back to the empty state a few seconds after showing the
  // confirmation, so the widget doesn't sit there permanently with a
  // stale "Thanks, X!" message — ready for the next visitor or another scan.
  useEffect(() => {
    if (step !== "submitted") return;
    const timer = setTimeout(() => {
      setStep("url");
      setUrl("");
      setBusinessName("");
      setEmail("");
      setWhatsapp("");
      setReport(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div
      ref={rootRef}
      className="card-dark relative overflow-hidden rounded-2xl border-violet/30 bg-navy-800 p-6 shadow-glow sm:p-8"
    >
      {(step === "url" || step === "loading" || step === "error") && (
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            See Your AI Opportunity in{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              60 Seconds
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-mist sm:text-base">
            Enter your website and we&apos;ll show you where AI can create the
            biggest impact for your business.
          </p>
        </div>
      )}

      {step === "url" && (
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
      )}

      {step === "loading" && (
        <div className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-3 py-6">
          <Loader2 size={28} className="animate-spin text-violet" />
          <p className="text-sm text-mist">
            Scanning <span className="text-white">{url}</span>… analyzing SSL,
            mobile-friendliness, SEO, and AI readiness.
          </p>
        </div>
      )}

      {step === "error" && (
        <div className="mx-auto mt-6 max-w-lg">
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            {errorMsg}
          </div>
          <button
            onClick={() => setStep("url")}
            className="focus-ring mx-auto mt-4 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            <RotateCcw size={14} /> Try a different URL
          </button>
        </div>
      )}

      {step === "results" && report && (
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
            <AnimatedScoreRing score={report.readinessScore} size={100} />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs text-mist">Scan results for</p>
              <p className="break-all text-sm font-semibold text-white">{report.url}</p>
              <p className="mt-1 text-2xl font-extrabold text-white">
                AI Readiness: {report.readinessScore}/100
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {report.opportunities.map((o) => (
              <div
                key={o.area}
                className="rounded-lg bg-navy-700 px-4 py-2.5 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{o.area}</span>
                  <span className={`text-xs font-semibold ${LEVEL_COLOR[o.level]}`}>
                    {o.level}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-mist">{o.reason}</p>
              </div>
            ))}
          </div>

          {report.businessCase && (
            <div className="mt-5 rounded-xl border border-violet/20 bg-navy-700/60 p-4">
              <p className="text-sm text-white/90">{report.businessCase.summary}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 text-white">
                  <Package size={14} className="text-violet" />
                  {report.businessCase.recommendedPackage.name}{" "}
                  <span className="text-mist">
                    ({report.businessCase.recommendedPackage.price},{" "}
                    {report.businessCase.recommendedPackage.period})
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <Clock size={14} className="text-violet" />
                  {report.businessCase.estimatedTimeline} to launch
                </span>
              </div>

              {report.businessCase.projectedOutcomes.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-mist">
                    What this means for you
                  </p>
                  {report.businessCase.projectedOutcomes.map((outcome) => (
                    <p key={outcome} className="flex items-start gap-1.5 text-xs text-white/80">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                      {outcome}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={() => setStep("url")}
              className="focus-ring flex items-center gap-2 text-sm text-mist hover:text-white"
            >
              <RotateCcw size={14} /> Scan another site
            </button>
            <button
              onClick={() => setStep("details")}
              className="btn-gradient focus-ring flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm"
            >
              Get This Report Emailed →
            </button>
          </div>
        </div>
      )}

      {step === "details" && (
        <form
          onSubmit={handleDetailsSubmit}
          className="mx-auto mt-2 max-w-lg space-y-3"
        >
          <p className="text-center text-xs text-mist">
            Where should we send the report for{" "}
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
            disabled={submitting}
            className="btn-gradient focus-ring flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Get My Report"}
            {!submitting && <span aria-hidden>→</span>}
          </button>
        </form>
      )}

      {step === "submitted" && (
        <div className="mx-auto mt-6 flex max-w-lg items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-300">
          <Check size={16} className="shrink-0" />
          Thanks, {businessName}! We&apos;ve saved your scan and you&apos;re
          enrolled in our follow-up sequence — check {email} over the next
          few days.
        </div>
      )}
    </div>
  );
}
