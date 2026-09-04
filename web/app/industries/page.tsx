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
import CTABand from "@/components/CTABand";

const industries = [
  {
    id: "hospitality",
    icon: Bell,
    name: "Hospitality",
    desc: "AI concierge, instant guest support and seamless bookings.",
    stats: ["More Bookings", "Happy Guests", "24/7 Support"],
    assistant: "AI Concierge",
    prompts: ["Check availability", "Hotel amenities", "Nearby attractions"],
  },
  {
    id: "healthcare",
    icon: Cross,
    name: "Healthcare",
    desc: "Answer patient questions, schedule appointments and reduce no-shows.",
    stats: ["Fewer No-Shows", "Save Staff Time", "Better Care"],
    assistant: "AI Assistant",
    prompts: ["Book appointment", "Clinic hours", "Insurance info"],
  },
  {
    id: "retail-ecommerce",
    icon: ShoppingCart,
    name: "Retail & E-commerce",
    desc: "AI product advisor, personalized recommendations and order support.",
    stats: ["More Sales", "Higher Conversion", "Better Experience"],
    assistant: "AI Product Advisor",
    prompts: ["Find products", "Track order", "Returns & refunds"],
  },
  {
    id: "professional-services",
    icon: Briefcase,
    name: "Professional Services",
    desc: "Qualify leads, book consultations and deliver instant information.",
    stats: ["Qualified Leads", "Booked Meetings", "Stronger Pipeline"],
    assistant: "AI Assistant",
    prompts: ["Book a consultation", "Our services", "Case studies"],
  },
  {
    id: "education",
    icon: GraduationCap,
    name: "Education",
    desc: "Engage students, answer questions and streamline admissions.",
    stats: ["More Inquiries", "Higher Enrollment", "Happy Students"],
    assistant: "AI Admissions",
    prompts: ["Programs & courses", "Admission process", "Tuition & fees"],
  },
  {
    id: "real-estate",
    icon: Home,
    name: "Real Estate",
    desc: "AI property advisor, lead capture and appointment booking.",
    stats: ["More Leads", "Booked Viewings", "Faster Closings"],
    assistant: "AI Property Advisor",
    prompts: ["Search properties", "Book a viewing", "Market value"],
  },
];

export default function IndustriesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              AI That Understands Your{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Industry.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-mist">
              Every business is different. TechWokx adapts AI to your
              industry, your customers and your goals.
            </p>
            <a
              href="/#scan"
              className="btn-gradient focus-ring mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
            >
              Scan My Website →
            </a>
          </div>
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

            {/* Center portal */}
            <div
              className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient shadow-glow"
              style={{ left: "50%", top: "50%" }}
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-md" />
              <Sparkles size={24} className="relative text-white" />
            </div>

            {[
              { label: "Hospitality", icon: Bell, ring: "border-pink-400/50", tint: "text-pink-400", pos: { left: "50%", top: "12%" } },
              { label: "Healthcare", icon: Cross, ring: "border-emerald-400/50", tint: "text-emerald-400", pos: { left: "83%", top: "28%" } },
              { label: "Retail & E-commerce", icon: ShoppingCart, ring: "border-orange-400/50", tint: "text-orange-400", pos: { left: "83%", top: "72%" } },
              { label: "Professional Services", icon: Briefcase, ring: "border-violet/50", tint: "text-violet", pos: { left: "50%", top: "88%" } },
              { label: "Education", icon: GraduationCap, ring: "border-azure/50", tint: "text-azure", pos: { left: "17%", top: "72%" } },
              { label: "Real Estate", icon: Home, ring: "border-blue-400/50", tint: "text-blue-400", pos: { left: "17%", top: "28%" } },
            ].map((node) => (
              <div
                key={node.label}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={node.pos}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${node.ring} bg-navy-800 shadow-glow`}>
                  <node.icon size={22} className={node.tint} />
                </div>
                <span className="whitespace-nowrap text-xs font-medium text-white/80">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Built for every business</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              AI Solutions For Your Industry
            </h2>
            <p className="mt-3 text-slate-500">
              Explore how TechWokx helps businesses in different industries
              attract, engage and serve customers better with AI.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <div
                key={ind.name}
                id={ind.id}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50">
                    <ind.icon size={18} className="text-violet-600" />
                  </div>
                  <h3 className="font-bold text-navy">{ind.name}</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-500">{ind.desc}</p>
                  <div className="mt-4 rounded-xl bg-slate-50 p-3.5">
                    <p className="text-xs font-semibold text-violet-600">
                      {ind.assistant}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ind.prompts.map((p) => (
                        <span
                          key={p}
                          className="rounded-md bg-white px-2 py-1 text-[11px] text-slate-600 shadow-sm"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                  {ind.stats.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 sm:flex-row sm:justify-between sm:text-left">
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
              <div className="text-slate-300">→</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800">
                <Sparkles size={18} className="text-violet-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        heading="See What AI Can Do For"
        highlight="Your Business"
        subtext="Discover your industry-specific AI opportunities in 60 seconds."
      />
    </>
  );
}
