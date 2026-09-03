import {
  Bell,
  Cross,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Home,
} from "lucide-react";
import CTABand from "@/components/CTABand";

const industries = [
  {
    icon: Bell,
    name: "Hospitality",
    desc: "AI concierge, instant guest support and seamless bookings.",
    stats: ["More Bookings", "Happy Guests", "24/7 Support"],
    assistant: "AI Concierge",
    prompts: ["Check availability", "Hotel amenities", "Nearby attractions"],
  },
  {
    icon: Cross,
    name: "Healthcare",
    desc: "Answer patient questions, schedule appointments and reduce no-shows.",
    stats: ["Fewer No-Shows", "Save Staff Time", "Better Care"],
    assistant: "AI Assistant",
    prompts: ["Book appointment", "Clinic hours", "Insurance info"],
  },
  {
    icon: ShoppingCart,
    name: "Retail & E-commerce",
    desc: "AI product advisor, personalized recommendations and order support.",
    stats: ["More Sales", "Higher Conversion", "Better Experience"],
    assistant: "AI Product Advisor",
    prompts: ["Find products", "Track order", "Returns & refunds"],
  },
  {
    icon: Briefcase,
    name: "Professional Services",
    desc: "Qualify leads, book consultations and deliver instant information.",
    stats: ["Qualified Leads", "Booked Meetings", "Stronger Pipeline"],
    assistant: "AI Assistant",
    prompts: ["Book a consultation", "Our services", "Case studies"],
  },
  {
    icon: GraduationCap,
    name: "Education",
    desc: "Engage students, answer questions and streamline admissions.",
    stats: ["More Inquiries", "Higher Enrollment", "Happy Students"],
    assistant: "AI Admissions",
    prompts: ["Programs & courses", "Admission process", "Tuition & fees"],
  },
  {
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
          <div className="grid grid-cols-3 gap-4">
            {industries.map((ind) => (
              <div
                key={ind.name}
                className="card-dark flex flex-col items-center gap-2 rounded-xl p-4 text-center"
              >
                <ind.icon size={22} className="text-violet" />
                <span className="text-xs font-medium text-white/80">
                  {ind.name}
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
                className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
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

          <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="eyebrow">Any industry. Any website.</p>
            <h3 className="text-xl font-bold text-navy">
              Don&apos;t See Your Industry?
            </h3>
            <p className="text-slate-500">
              If you have a website, TechWokx can help you unlock AI
              opportunities.
            </p>
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
