import {
  Target,
  TrendingUp,
  Headphones,
  CalendarClock,
  BookOpen,
  Settings2,
  User,
  Bot,
  MessageCircle,
  CheckCircle2,
  Building2,
  ShoppingCart,
  ThumbsUp,
  UserRound,
  HelpCircle,
  Zap,
} from "lucide-react";
import CTABand from "@/components/CTABand";

const colors = {
  violet: { icon: "text-violet-600", bg: "bg-violet-50", link: "text-violet-600" },
  blue: { icon: "text-blue-600", bg: "bg-blue-50", link: "text-blue-600" },
  emerald: { icon: "text-emerald-600", bg: "bg-emerald-50", link: "text-emerald-600" },
  orange: { icon: "text-orange-600", bg: "bg-orange-50", link: "text-orange-600" },
  cyan: { icon: "text-cyan-600", bg: "bg-cyan-50", link: "text-cyan-600" },
};

const solutions = [
  {
    id: "generate-more-leads",
    icon: Target,
    color: colors.violet,
    num: "01",
    title: "Generate More Leads",
    desc: "AI engages visitors, qualifies them and captures high-intent leads.",
    flow: [
      { icon: UserRound, label: "Visitor" },
      { icon: MessageCircle, label: "AI Chat" },
      { icon: CheckCircle2, label: "Qualified" },
      { icon: Building2, label: "CRM" },
    ],
  },
  {
    id: "increase-sales",
    icon: TrendingUp,
    color: colors.blue,
    num: "02",
    title: "Increase Sales",
    desc: "AI recommends, persuades and turns interest into sales.",
    flow: [
      { icon: UserRound, label: "Visitor" },
      { icon: ThumbsUp, label: "AI Recommends" },
      { icon: ShoppingCart, label: "Purchase" },
    ],
  },
  {
    id: "automate-support",
    icon: Headphones,
    color: colors.emerald,
    num: "03",
    title: "Automate Support",
    desc: "AI answers questions, resolves issues and escalates only when needed.",
    flow: [
      { icon: UserRound, label: "Customer" },
      { icon: Headphones, label: "AI Support" },
      { icon: User, label: "Human (rare)" },
    ],
  },
  {
    id: "automate-bookings",
    icon: CalendarClock,
    color: colors.orange,
    num: "04",
    title: "Automate Bookings",
    desc: "AI checks availability, schedules appointments and sends reminders.",
    flow: [
      { icon: UserRound, label: "Visitor" },
      { icon: CalendarClock, label: "AI Booking" },
      { icon: CheckCircle2, label: "Calendar" },
    ],
  },
  {
    id: "unlock-knowledge",
    icon: BookOpen,
    color: colors.violet,
    num: "05",
    title: "Unlock Knowledge",
    desc: "AI finds answers from your content so your team and customers get instant help.",
    flow: [
      { icon: HelpCircle, label: "Question" },
      { icon: BookOpen, label: "AI Knowledge" },
      { icon: CheckCircle2, label: "Answer" },
    ],
  },
  {
    id: "automate-operations",
    icon: Settings2,
    color: colors.cyan,
    num: "06",
    title: "Automate Operations",
    desc: "AI connects tools and systems to automate repetitive business tasks.",
    flow: [
      { icon: Bot, label: "AI Trigger" },
      { icon: Building2, label: "Business Systems" },
      { icon: CheckCircle2, label: "Automated Action" },
    ],
  },
];

const journey = [
  { icon: User, label: "Visitor" },
  { icon: Bot, label: "AI Understands" },
  { icon: MessageCircle, label: "AI Engages" },
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
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.color.bg}`}>
                    <s.icon size={22} className={s.color.icon} />
                  </div>
                  <span className={`text-xs font-semibold ${s.color.link} opacity-60`}>
                    {s.num}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {s.desc}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  {s.flow.map((step, i) => (
                    <span key={step.label} className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                        <step.icon size={13} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-600">
                          {step.label}
                        </span>
                      </span>
                      {i < s.flow.length - 1 && (
                        <span className={`text-xs ${s.color.link}`}>→</span>
                      )}
                    </span>
                  ))}
                </div>
                <a
                  href="#"
                  className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${s.color.link}`}
                >
                  Learn how it works →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-violet-50 to-indigo-50 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-extrabold text-navy sm:text-3xl">
              From Visitor To Business Outcome
            </h2>
            <p className="mt-3 text-slate-500">
              TechWokx turns your website into an intelligent business engine.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-8">
            {journey.map((j, i) => (
              <div key={j.label} className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2.5 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md shadow-violet-100">
                    <j.icon size={24} strokeWidth={1.75} className="text-violet-500" />
                  </div>
                  <span className="text-xs font-medium text-navy/70">{j.label}</span>
                </div>
                {i < journey.length - 1 && (
                  <span className="hidden text-violet-300 sm:block">›</span>
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
