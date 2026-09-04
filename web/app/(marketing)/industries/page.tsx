import type { Metadata } from "next";
import Link from "next/link";
import {
  Bell,
  Cross,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Home,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import IndustryChatWidget from "@/components/IndustryChatWidget";

export const metadata: Metadata = {
  title: "AI By Industry — Hospitality, Healthcare, Retail, Real Estate & More",
  description:
    "TechWokx adapts AI to your industry: Hospitality, Healthcare, Retail & E-commerce, Professional Services, Education and Real Estate — each with its own AI assistant setup.",
  alternates: { canonical: "/industries" },
  openGraph: { url: "/industries", title: "AI That Understands Your Industry | TechWokx" },
};

const hexNodes = [
  { label: "Hospitality", icon: Bell, ring: "border-pink-400/50", tint: "text-pink-400", pos: { left: "50%", top: "12%" } },
  { label: "Healthcare", icon: Cross, ring: "border-emerald-400/50", tint: "text-emerald-400", pos: { left: "83%", top: "28%" } },
  { label: "Retail & E-commerce", icon: ShoppingCart, ring: "border-orange-400/50", tint: "text-orange-400", pos: { left: "83%", top: "72%" } },
  { label: "Professional Services", icon: Briefcase, ring: "border-violet/50", tint: "text-violet", pos: { left: "50%", top: "88%" } },
  { label: "Education", icon: GraduationCap, ring: "border-azure/50", tint: "text-azure", pos: { left: "17%", top: "72%" } },
  { label: "Real Estate", icon: Home, ring: "border-blue-400/50", tint: "text-blue-400", pos: { left: "17%", top: "28%" } },
];

const industries = [
  {
    id: "hospitality",
    icon: Bell,
    iconBg: "bg-violet-600",
    name: "Hospitality",
    desc: "AI concierge, instant guest support and seamless bookings.",
    photo: "/industries/hospitality.jpg",
    widgetLabel: "AI Concierge",
    widgetBg: "bg-violet-600",
    accent: "bg-violet-600",
    greeting: "Hi! 👋 How can I help you today?",
    prompts: ["Check availability", "Hotel amenities", "Nearby attractions"],
    stats: ["More Bookings", "Happy Guests", "24/7 Support"],
  },
  {
    id: "healthcare",
    icon: Cross,
    iconBg: "bg-emerald-600",
    name: "Healthcare",
    desc: "Answer patient questions, schedule appointments and reduce no-shows.",
    photo: "/industries/healthcare.jpg",
    widgetLabel: "AI Assistant",
    widgetBg: "bg-emerald-600",
    accent: "bg-emerald-600",
    greeting: "Hello! How can I assist you today?",
    prompts: ["Book appointment", "Clinic hours", "Insurance info"],
    stats: ["Fewer No-Shows", "Save Staff Time", "Better Care"],
  },
  {
    id: "retail-ecommerce",
    icon: ShoppingCart,
    iconBg: "bg-orange-600",
    name: "Retail & E-commerce",
    desc: "AI product advisor, personalized recommendations and order support.",
    photo: "/industries/retail.jpg",
    widgetLabel: "AI Product Advisor",
    widgetBg: "bg-orange-600",
    accent: "bg-orange-600",
    greeting: "What are you looking for today?",
    prompts: ["Find products", "Track order", "Returns & refunds"],
    stats: ["More Sales", "Higher Conversion", "Better Experience"],
  },
  {
    id: "professional-services",
    icon: Briefcase,
    iconBg: "bg-blue-600",
    name: "Professional Services",
    desc: "Qualify leads, book consultations and deliver instant information.",
    photo: "/industries/professional.jpg",
    widgetLabel: "AI Assistant",
    widgetBg: "bg-blue-600",
    accent: "bg-blue-600",
    greeting: "Hi! How can we help your business?",
    prompts: ["Book a consultation", "Our services", "Case studies"],
    stats: ["Qualified Leads", "Booked Meetings", "Stronger Pipeline"],
  },
  {
    id: "education",
    icon: GraduationCap,
    iconBg: "bg-blue-600",
    name: "Education",
    desc: "Engage students, answer questions and streamline admissions.",
    photo: "/industries/education.jpg",
    widgetLabel: "AI Admissions",
    widgetBg: "bg-blue-600",
    accent: "bg-blue-600",
    greeting: "Hello! How can I help you today?",
    prompts: ["Programs & courses", "Admission process", "Tuition & fees"],
    stats: ["More Inquiries", "Higher Enrollment", "Happy Students"],
  },
  {
    id: "real-estate",
    icon: Home,
    iconBg: "bg-violet-600",
    name: "Real Estate",
    desc: "AI property advisor, lead capture and appointment booking.",
    photo: "/industries/realestate.jpg",
    widgetLabel: "AI Property Advisor",
    widgetBg: "bg-violet-600",
    accent: "bg-violet-600",
    greeting: "How can I help you find the perfect property?",
    prompts: ["Search properties", "Book a viewing", "Market value"],
    stats: ["More Leads", "Booked Viewings", "Faster Closings"],
  },
];

export default function IndustriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                AI That Understands Your{" "}
                <span className="text-shimmer bg-brand-gradient bg-clip-text text-transparent">
                  Industry.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-mist">
                Every business is different. TechWokx adapts AI to your
                industry, your customers and your goals.
              </p>
              <Link
                href="/#scan"
                className="btn-gradient focus-ring mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
              >
                Scan My Website →
              </Link>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-mist">
                <span>✓ 100% Free</span>
                <span>✓ 60-Second Audit</span>
                <span>✓ No Credit Card</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} variant="scale">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <g stroke="#8b5cf6" strokeOpacity="0.35" strokeWidth="0.4" strokeDasharray="1.5 1.5">
                  <line x1="50" y1="50" x2="50" y2="12" />
                  <line x1="50" y1="50" x2="83" y2="28" />
                  <line x1="50" y1="50" x2="83" y2="72" />
                  <line x1="50" y1="50" x2="50" y2="88" />
                  <line x1="50" y1="50" x2="17" y2="72" />
                  <line x1="50" y1="50" x2="17" y2="28" />
                </g>
              </svg>

              <div
                className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient shadow-glow"
                style={{ left: "50%", top: "50%" }}
              >
                <div className="absolute inset-0 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-md" />
                <Sparkles size={24} className="relative text-white" />
              </div>

              {hexNodes.map((node, i) => (
                <div
                  key={node.label}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 animate-chip-float"
                  style={{ ...node.pos, animationDelay: `${i * 220}ms` }}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${node.ring} bg-navy-800 shadow-glow animate-icon-pulse`} style={{ animationDelay: `${i * 180}ms` }}>
                    <node.icon size={22} className={node.tint} />
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium text-white/80">
                    {node.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Industry cards */}
      <section className="py-20" style={{ backgroundColor: "rgb(247,247,250)" }}>
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Built for every business</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
                AI Solutions For Your Industry
              </h2>
              <p className="mt-3 text-slate-500">
                Explore how TechWokx helps businesses in different industries
                attract, engage and serve customers better with AI.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal key={ind.id} delay={i * 100} variant="scale">
                <Link
                  href="/#scan"
                  id={ind.id}
                  aria-label={`Scan my website for ${ind.name}`}
                  className="group relative block scroll-mt-24 overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="relative h-72 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ind.photo})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition group-hover:from-black/90" />

                    <div className="relative flex h-full flex-col justify-between p-5">
                      <div className="flex items-start gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ind.iconBg} shadow-lg`}>
                          <ind.icon size={20} className="text-white" />
                        </span>
                        <div>
                          <h3 className="font-bold text-white">{ind.name}</h3>
                          <p className="mt-0.5 text-xs leading-snug text-white/85">
                            {ind.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <IndustryChatWidget
                          label={ind.widgetLabel}
                          labelColor={ind.widgetBg}
                          greeting={ind.greeting}
                          prompts={ind.prompts}
                          accent={ind.accent}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 bg-white px-5 py-3 text-xs text-slate-500">
                    {ind.stats.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mx-auto mt-16 flex max-w-3xl flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="eyebrow">Any industry. Any website.</p>
                <h3 className="mt-1 text-xl font-bold text-navy">
                  Don&apos;t See Your Industry?
                </h3>
                <p className="mt-1 text-slate-500">
                  If you have a website, TechWokx can help you unlock AI
                  opportunities.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="w-40 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
                  <div className="mb-2 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-violet-600">
                    <TrendingUp size={12} /> Your Website
                  </div>
                </div>
                <Link
                  href="/#scan"
                  aria-label="Scan my website"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 transition hover:scale-105"
                >
                  <Sparkles size={18} className="text-violet-400" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
