import type { Metadata } from "next";
import {
  Check,
  MessageSquare,
  TrendingUp,
  Rocket,
  Sparkles,
  Globe,
} from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Pricing — One-Time AI Website Projects",
  description:
    "Simple, one-time project pricing for AI website retrofits: AI Assistant, AI Business, and AI Business Platform. Custom website builds include hosting from Year 2.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing", title: "Pricing | TechWokx" },
};

const plans = [
  {
    icon: MessageSquare,
    tag: "STARTER",
    name: "AI Assistant",
    tagline: "Add an intelligent assistant to your website.",
    price: "$79",
    period: "one-time",
    features: [
      "AI Website Assistant",
      "Answer Customer Questions",
      "Capture Leads",
      "Basic Knowledge Integration",
      "Conversation Dashboard",
      "Email Notifications",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    icon: TrendingUp,
    tag: "GROWTH",
    name: "AI Business",
    tagline: "Turn your website into a lead and sales machine.",
    price: "$199",
    period: "one-time",
    features: [
      "Everything in Starter",
      "AI Sales Agent",
      "Lead Qualification",
      "CRM Integrations",
      "Advanced Analytics",
      "Priority Support",
      "Custom AI Instructions",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    icon: Rocket,
    tag: "SCALE",
    name: "AI Business Platform",
    tagline: "Full AI automation for growing businesses.",
    price: "Custom",
    period: "one-time",
    features: [
      "Everything in Growth",
      "AI Support Agent",
      "AI Booking Agent",
      "AI Automation Workflows",
      "Advanced Integrations",
      "Custom AI Development",
      "Dedicated Support",
      "SLA & Performance Guarantee",
    ],
    cta: "Talk to an Expert",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Start Small.
                <br />
                <span className="text-shimmer bg-brand-gradient bg-clip-text text-transparent">
                  Grow Into AI.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-lg text-mist">
                Begin with your website. Add intelligence as your business
                grows.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-mist">
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-violet" /> One-Time Project Cost
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-violet" /> No Recurring Fees
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-violet" /> 30-Day Money Back
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} variant="scale">
            <div className="mt-14 flex flex-col items-center justify-center gap-6 xl:flex-row">
              <div className="w-56 shrink-0 rounded-xl border border-white/10 bg-navy-800 p-4">
                <div className="mb-3 flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                </div>
                <p className="text-sm font-semibold text-white">Your Website</p>
                <p className="text-xs text-mist">Your business online</p>
                <div className="mt-3 space-y-1.5">
                  <div className="h-2 w-3/4 rounded-full bg-white/10" />
                  <div className="h-2 w-1/2 rounded-full bg-white/10" />
                  <div className="mt-1.5 h-10 rounded-lg bg-white/5" />
                </div>
              </div>

              <svg width="48" height="2" className="hidden text-violet/40 xl:block">
                <line x1="0" y1="1" x2="48" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-gradient shadow-glow">
                <div className="absolute inset-0 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-md" />
                <Sparkles size={24} className="relative text-white" />
              </div>
              <svg width="48" height="2" className="hidden text-blue-400/40 xl:block">
                <line x1="0" y1="1" x2="48" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              <div className="btn-gradient shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold">
                TechWokx AI Layer
              </div>
              <svg width="48" height="2" className="hidden text-blue-400/40 xl:block">
                <line x1="0" y1="1" x2="48" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

              <div className="card-dark w-full max-w-xs shrink-0 rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-mist">
                  AI Performance
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-2xl font-bold text-white">128</p>
                    <p className="text-mist">Leads <span className="text-emerald-400">+28%</span></p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">42</p>
                    <p className="text-mist">Bookings <span className="text-emerald-400">+35%</span></p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">1,248</p>
                    <p className="text-mist">Conversations <span className="text-emerald-400">+42%</span></p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">81%</p>
                    <p className="text-mist">AI Resolution</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Choose your path</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Simple Plans. Powerful Results.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 120}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                    plan.highlight
                      ? "border-violet-600 shadow-lg shadow-violet-100"
                      : "border-slate-200"
                  }`}
                >
                  {plan.highlight && (
                    <span className="btn-gradient absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs">
                      Most Popular
                    </span>
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                    <plan.icon size={22} className="text-violet-600" />
                  </div>
                  <p className="mt-4 text-xs font-semibold tracking-wide text-violet-600">
                    {plan.tag}
                  </p>
                  <h3 className="text-xl font-bold text-navy">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-navy">
                      {plan.price}
                    </span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  {plan.period && plan.price !== "Custom" && (
                    <p className="text-xs text-slate-400">One-time project fee</p>
                  )}
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={16} className="mt-0.5 shrink-0 text-violet-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/#scan"
                    className={`focus-ring mt-7 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
                      plan.highlight
                        ? "btn-gradient"
                        : "border border-slate-300 text-navy hover:border-violet-400"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "rgb(245,243,255)" }}>
        <div className="container-page">
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 rounded-2xl border-l-4 border-l-violet-600 bg-white p-7 shadow-xl shadow-violet-200/50 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-glow">
                <Globe size={26} className="text-white" />
              </div>
              <div>
                <p className="eyebrow">Good to know</p>
                <p className="mt-1 text-base font-bold text-navy">
                  Building a brand new custom website?
                </p>
                <p className="mt-1.5 text-sm text-slate-600">
                  Custom website builds are also a one-time project fee.
                  Hosting, SSL, backups, monitoring and a baseline AI
                  allowance are included — billed annually starting Year 2.
                  AI retrofits on an existing site don&apos;t need hosting,
                  so it&apos;s not part of those packages above.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "rgb(248,249,250)" }}>
        <div className="container-page">
          <Reveal delay={200} variant="scale">
            <div className="mt-4">
              <img
                src="/mockups/journey-grows.png"
                alt="How Your AI Journey Grows: Scan, Retrofit, Automate, Grow — plus 100% Secure, Quick Setup, No Code Needed, Works With What You Use, Always Improving"
                className="mx-auto w-full max-w-4xl"
                style={{ aspectRatio: "896 / 293" }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
