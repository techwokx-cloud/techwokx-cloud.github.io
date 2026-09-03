import {
  Target,
  TrendingUp,
  Headphones,
  CalendarClock,
  BookOpen,
  Settings2,
  User,
  Bot,
  Zap,
} from "lucide-react";
import CTABand from "@/components/CTABand";

const solutions = [
  {
    id: "generate-more-leads",
    icon: Target,
    title: "Generate More Leads",
    desc: "AI engages visitors, qualifies them and captures high-intent leads.",
    flow: ["Visitor", "AI Chat", "Qualified", "CRM"],
  },
  {
    id: "increase-sales",
    icon: TrendingUp,
    title: "Increase Sales",
    desc: "AI recommends, persuades and turns interest into sales.",
    flow: ["Visitor", "AI Recommends", "Purchase"],
  },
  {
    id: "automate-support",
    icon: Headphones,
    title: "Automate Support",
    desc: "AI answers questions, resolves issues and escalates only when needed.",
    flow: ["Customer", "AI Support", "Human (rare)"],
  },
  {
    id: "automate-bookings",
    icon: CalendarClock,
    title: "Automate Bookings",
    desc: "AI checks availability, schedules appointments and sends reminders.",
    flow: ["Visitor", "AI Booking", "Calendar"],
  },
  {
    id: "unlock-knowledge",
    icon: BookOpen,
    title: "Unlock Knowledge",
    desc: "AI finds answers from your content so your team and customers get instant help.",
    flow: ["Question", "AI Knowledge", "Answer"],
  },
  {
    id: "automate-operations",
    icon: Settings2,
    title: "Automate Operations",
    desc: "AI connects tools and systems to automate repetitive business tasks.",
    flow: ["AI Trigger", "Business Systems", "Automated Action"],
  },
];

const journey = [
  { icon: User, label: "Visitor" },
  { icon: Bot, label: "AI Understands" },
  { icon: Headphones, label: "AI Engages" },
  { icon: Target, label: "AI Qualifies" },
  { icon: Zap, label: "AI Acts" },
  { icon: TrendingUp, label: "Business Outcome" },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Intelligent solutions that drive real results</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              What Do You Want AI To Do For{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Your Business?
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-mist">
              Turn repetitive work into intelligent action. Better
              conversations. More leads. Happier customers.
            </p>
            <a
              href="/#scan"
              className="btn-gradient focus-ring mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
            >
              Scan My Website →
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Our solutions</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              AI That Delivers Real Business Outcomes
            </h2>
            <p className="mt-3 text-slate-500">
              Choose the results you want. TechWokx makes it happen.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {solutions.map((s) => (
              <div
                key={s.title}
                id={s.id}
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                  <s.icon size={22} className="text-violet-600" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {s.desc}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-400">
                  {s.flow.map((step, i) => (
                    <span key={step} className="flex items-center gap-2">
                      <span className="rounded-md border border-slate-200 px-2 py-1 font-medium text-slate-600">
                        {step}
                      </span>
                      {i < s.flow.length - 1 && <span>→</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-800 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              From Visitor To Business Outcome
            </h2>
            <p className="mt-3 text-mist">
              TechWokx turns your website into an intelligent business engine.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-8">
            {journey.map((j, i) => (
              <div key={j.label} className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-violet/30 bg-navy-700">
                    <j.icon size={22} className="text-violet" />
                  </div>
                  <span className="text-xs text-mist">{j.label}</span>
                </div>
                {i < journey.length - 1 && (
                  <span className="hidden text-mist sm:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Discover Your Best"
        highlight="AI Opportunity"
        subtext="See exactly where AI can make the biggest impact on your website and your business."
      />
    </>
  );
}
