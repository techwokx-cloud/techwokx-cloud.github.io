import {
  Check,
  MessageSquare,
  TrendingUp,
  Rocket,
  Search,
  Wrench,
  Zap,
  BarChart3,
  ShieldCheck,
  Gauge,
  Code2,
  Puzzle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import CTABand from "@/components/CTABand";

const plans = [
  {
    icon: MessageSquare,
    tag: "STARTER",
    name: "AI Assistant",
    tagline: "Add an intelligent assistant to your website.",
    price: "$79",
    period: "/month",
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
    period: "/month",
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
    period: "",
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

const journey = [
  { icon: Search, title: "Scan", desc: "Discover your AI opportunities." },
  { icon: Wrench, title: "Retrofit", desc: "We add the right AI capabilities." },
  { icon: Zap, title: "Automate", desc: "AI works 24/7 to engage, qualify and convert." },
  { icon: BarChart3, title: "Grow", desc: "More leads, more sales, happier customers." },
];

const trust = [
  { icon: ShieldCheck, title: "100% Secure", desc: "Enterprise-grade security." },
  { icon: Rocket, title: "Quick Setup", desc: "Get started in days, not months." },
  { icon: Code2, title: "No Code Needed", desc: "Manage everything easily." },
  { icon: Puzzle, title: "Works With What You Use", desc: "Connect your favorite tools." },
  { icon: RefreshCw, title: "Always Improving", desc: "Continuous AI updates." },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Start Small.
              <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Grow Into AI.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-mist">
              Begin with your website. Add intelligence as your business
              grows.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-mist">
              <span className="flex items-center gap-1.5">
                <Check size={13} className="text-violet" /> No Setup Fees
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={13} className="text-violet" /> Cancel Anytime
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={13} className="text-violet" /> 30-Day Money Back
              </span>
            </div>
          </div>

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
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Choose your path</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Simple Plans. Powerful Results.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-7 ${
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
                {plan.period && (
                  <p className="text-xs text-slate-400">Billed monthly</p>
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
                  href="#"
                  className={`focus-ring mt-7 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    plan.highlight
                      ? "btn-gradient"
                      : "border border-slate-300 text-navy hover:border-violet-400"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-center text-xl font-bold text-navy">
              How Your AI Journey Grows
            </h3>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {journey.map((j) => (
                <div key={j.title} className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
                    <j.icon size={22} className="text-violet-600" />
                  </div>
                  <h4 className="mt-3 font-semibold text-navy">{j.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{j.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 rounded-2xl bg-slate-50 p-8 sm:grid-cols-5">
            {trust.map((t) => (
              <div key={t.title} className="flex flex-col items-center gap-2 text-center">
                <t.icon size={20} className="text-violet-600" />
                <p className="text-xs font-semibold text-navy">{t.title}</p>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Ready to See What AI Can Do For"
        highlight="Your Business?"
        subtext="Get your personalized AI audit and discover your best opportunities."
      />
    </>
  );
}
