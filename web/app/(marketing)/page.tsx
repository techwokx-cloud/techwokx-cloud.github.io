import type { Metadata } from "next";
import {
  Star,
  UserCheck,
  Zap,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import HeroScanBar from "@/components/HeroScanBar";
import Reveal from "@/components/Reveal";
import Typewriter from "@/components/Typewriter";
import CircuitLines from "@/components/CircuitLines";
import BookingMiniDemo from "@/components/BookingMiniDemo";

export const metadata: Metadata = {
  title: "AI For Your Website — Free Website Scan & AI Retrofit",
  description:
    "Free 60-second AI website scan. Get your AI Readiness Score, top opportunities, and a personalized retrofit plan — AI sales, support, booking and knowledge agents added to your existing site.",
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: "TechWokx — Your Website. Now Intelligent." },
};

const logoSlots = [1, 2, 3, 4, 5, 6];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink pb-20 pt-16 sm:pt-24">
        <div className="container-page relative">
          <CircuitLines />
          {/* Decorative floating chips — only shown where there's real room */}
          <div className="pointer-events-none absolute left-0 top-8 hidden w-64 flex-col gap-4 xl:flex">
            <div
              className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4 animate-chip-float"
              style={{ animationDelay: "0ms" }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/15 animate-icon-pulse">
                <MessageCircle size={15} className="text-violet" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Answers</span>
            </div>
            <div className="card-dark w-56 rounded-2xl p-3.5">
              <p className="text-xs text-white/80">🤖 AI Assistant</p>
              <p className="mt-1.5 min-h-[32px] text-xs text-white/80">
                <Typewriter text="Hi! How can I help your business today?" />
              </p>
              <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-navy-700 px-2.5 py-2">
                <span className="flex-1 text-[11px] text-mist">Ask me anything...</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-azure animate-icon-pulse">
                  <ArrowUpRight size={11} className="text-white" />
                </span>
              </div>
            </div>
            <div
              className="card-dark flex items-center gap-2 self-start rounded-full py-2 pl-2.5 pr-4 animate-chip-float"
              style={{ animationDelay: "600ms" }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/15 animate-icon-pulse"
                style={{ animationDelay: "300ms" }}
              >
                <Star size={15} className="text-pink-400" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Recommends</span>
            </div>
          </div>

          <div className="pointer-events-none absolute right-0 top-8 hidden w-56 flex-col items-end gap-4 xl:flex">
            <div
              className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4 animate-chip-float"
              style={{ animationDelay: "200ms" }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 animate-icon-pulse"
                style={{ animationDelay: "100ms" }}
              >
                <UserCheck size={15} className="text-azure" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Qualifies</span>
            </div>
            <div
              className="animate-chip-float"
              style={{ animationDelay: "800ms" }}
            >
              <BookingMiniDemo />
            </div>
            <div
              className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4 animate-chip-float"
              style={{ animationDelay: "1400ms" }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/15 animate-icon-pulse"
                style={{ animationDelay: "900ms" }}
              >
                <Zap size={15} className="text-violet" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Takes Action</span>
            </div>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <Reveal as="span" className="eyebrow">
              Turn your website into an AI business engine
            </Reveal>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              <Reveal as="span">Your Website.</Reveal>
              <br />
              <Reveal as="span" delay={200} variant="scale">
                Now{" "}
                <span className="text-shimmer bg-brand-gradient bg-clip-text text-transparent">
                  Intelligent.
                </span>
              </Reveal>
            </h1>
            <Reveal delay={380}>
              <p className="mx-auto mt-5 max-w-xl text-lg text-mist">
                TechWokx adds an AI layer to your website so it can understand,
                engage and help your customers 24/7.
              </p>
            </Reveal>
          </div>

          <Reveal delay={500}>
            <div id="scan" className="relative mx-auto mt-10 max-w-2xl scroll-mt-24">
              <HeroScanBar />
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm italic text-violet/80">
                <span aria-hidden>↴</span> It&apos;s fast, free and simple!
              </p>
            </div>
          </Reveal>

          <Reveal delay={650}>
            <div className="mx-auto mt-16 max-w-4xl">
              <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-mist">
                Trusted by forward-thinking businesses
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {logoSlots.map((i) => (
                  <div
                    key={i}
                    className="flex h-11 w-32 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"
                  >
                    <span className="text-[10px] uppercase tracking-wide text-white/25">
                      Client logo
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] text-white/30">
                Client logos manageable from the dashboard — placeholders for now.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AI Website Scanner feature */}
      <section className="bg-ink py-20">
        <div className="container-page">
          <Reveal variant="scale">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-[0_0_60px_-10px_rgba(124,58,237,0.45)]">
              <img
                src="/mockups/scanner-feature.png"
                alt="AI Website Scanner — Discover Your Best AI Opportunities. Free 60-second audit with AI Readiness Score, Top Opportunity Areas, and Personalized Recommendations."
                className="w-full"
                style={{ aspectRatio: "1023 / 610" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ backgroundColor: "rgb(247,247,248)" }}>
        <div className="container-page">
          <Reveal variant="scale">
            <img
              src="/mockups/from-website.png"
              alt="From Website to AI Business Engine: Scan, Discover, Retrofit, Automate, Grow"
              className="mx-auto w-full max-w-4xl"
              style={{ aspectRatio: "844 / 295" }}
            />
          </Reveal>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-ink py-20">
        <div className="container-page">
          <Reveal variant="scale">
            <img
              src="/mockups/smart-website.png"
              alt="What You Get — A Smarter Website. A Stronger Business: AI Conversations, More Qualified Leads, Automated Bookings, Smart Knowledge, 24/7 Support, Business Automation"
              className="mx-auto w-full max-w-5xl"
              style={{ aspectRatio: "1020 / 294" }}
            />
          </Reveal>
        </div>
      </section>

      {/* Featured client — honestly a reserved/placeholder spot, not a
          fabricated testimonial, until there's a real client to feature. */}
      <section className="py-20" style={{ backgroundColor: "rgb(247,247,248)" }}>
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal as="span" className="eyebrow">Featured Client</Reveal>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
              <Reveal as="span">Real Businesses.</Reveal>{" "}
              <Reveal as="span" delay={200} variant="scale">
                <span className="text-shimmer bg-brand-gradient bg-clip-text text-transparent">
                  Real Results.
                </span>
              </Reveal>
            </h2>
          </div>

          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-dashed border-violet-200 bg-white p-8 text-center sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                <Star size={26} className="text-violet-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">
                This spot is reserved for your success story.
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                We&apos;re just getting started — the first business to go
                through a full AI retrofit with TechWokx gets featured here,
                with real before/after results.
              </p>
              <a
                href="/#scan"
                className="btn-gradient focus-ring mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm"
              >
                Become Our Featured Client →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
