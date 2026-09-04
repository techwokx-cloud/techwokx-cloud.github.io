"use client";

import {
  BookOpen,
  Lightbulb,
  Users,
  CheckCircle2,
  Sparkles,
  User,
  FileText,
  Mail,
  UserCheck,
  Bot,
  MessageCircle,
  Zap,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import AnimatedScoreRing from "@/components/AnimatedScoreRing";
import FlowPulse from "@/components/FlowPulse";

const opportunities = [
  { label: "AI Sales", level: "HIGH", color: "text-emerald-400" },
  { label: "AI Support", level: "HIGH", color: "text-emerald-400" },
  { label: "AI Search", level: "MEDIUM", color: "text-amber-400" },
  { label: "AI Booking", level: "MEDIUM", color: "text-amber-400" },
];

const todayFlow = [
  { icon: User, label: "Visitor" },
  { icon: FileText, label: "Reads" },
  { icon: Mail, label: "Contact Form" },
  { icon: UserCheck, label: "Human Response" },
];

const aiFlow = [
  { icon: User, label: "Visitor" },
  { icon: Bot, label: "AI Understands" },
  { icon: MessageCircle, label: "AI Engages" },
  { icon: Zap, label: "AI Takes Action" },
];

export default function ScannerShowcase() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              See What AI Can Do For{" "}
              <span className="text-shimmer bg-brand-gradient bg-clip-text text-transparent">
                Your Business.
              </span>
            </h2>
            <p className="mt-3 max-w-md text-mist">
              Practical guides, insights and real examples to help you turn
              your website into an intelligent business engine.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} className="text-violet" /> Practical Guides
              </span>
              <span className="flex items-center gap-1.5">
                <Lightbulb size={15} className="text-violet" /> Expert Insights
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-violet" /> Real Results
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150} variant="scale">
          <div className="flex justify-center gap-3">
            {["AI Knowledge", "Insights", "Case Studies"].map((label, i) => (
              <div
                key={label}
                className="card-dark hidden rounded-xl px-4 py-3 text-xs font-medium text-white/80 sm:block"
                style={{ transform: `translateY(${i * 10}px) rotate(${(i - 1) * 3}deg)` }}
              >
                {label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={250} variant="scale">
        <div className="card-dark relative mt-10 overflow-hidden rounded-2xl border-violet/20 bg-navy-800 p-6 shadow-[0_0_60px_-10px_rgba(124,58,237,0.45)] sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: pitch + CTA */}
            <div>
              <span className="rounded-full bg-violet/15 px-3 py-1 text-xs font-semibold text-violet">
                FEATURED TOOL
              </span>
              <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                AI Website Scanner
              </h3>
              <p className="mt-1 text-mist">Discover Your Best AI Opportunities</p>
              <p className="mt-4 text-sm text-mist">
                Our free 60-second audit analyzes your website and reveals
                where AI can create the biggest impact.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                {["AI Readiness Score", "Top Opportunity Areas", "Personalized Recommendations"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-violet" /> {item}
                    </li>
                  )
                )}
              </ul>
              <a
                href="/#scan"
                className="btn-gradient focus-ring relative mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
              >
                <span className="absolute inset-0 rounded-xl animate-click-ripple" />
                <Sparkles size={16} className="relative" />
                <span className="relative">Scan My Website Now</span>
                <span className="relative" aria-hidden>→</span>
              </a>
              <p className="mt-3 text-xs text-mist">
                100% Free · 60 Seconds · No Credit Card
              </p>
            </div>

            {/* Right: live-feeling audit preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-dark col-span-2 flex items-center gap-6 rounded-xl p-5 sm:col-span-1">
                <AnimatedScoreRing score={72} size={96} />
                <div>
                  <p className="text-xs font-semibold text-mist">AI WEBSITE AUDIT</p>
                  <p className="text-sm text-white/80">AI Readiness Score</p>
                </div>
              </div>

              <div className="card-dark relative overflow-hidden rounded-xl p-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-violet/10 to-transparent animate-scan-sweep" />
                <p className="relative text-xs font-semibold text-mist">TOP OPPORTUNITY AREAS</p>
                <ul className="relative mt-3 space-y-2 text-xs">
                  {opportunities.map((o, i) => (
                    <li
                      key={o.label}
                      className="flex justify-between animate-badge-fade"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <span>{o.label}</span>
                      <span className={o.color}>{o.level}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-dark col-span-2 rounded-xl p-5 sm:col-span-1">
                <p className="mb-4 text-xs font-semibold text-mist">YOUR WEBSITE TODAY</p>
                <FlowPulse steps={todayFlow} accent="mist" speed={3.2} />
              </div>

              <div className="card-dark col-span-2 rounded-xl border-violet/20 p-5 sm:col-span-1">
                <p className="mb-4 text-xs font-semibold text-violet">WITH TECHWOKX AI</p>
                <FlowPulse steps={aiFlow} accent="violet" speed={1.8} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
