import {
  MessageCircle,
  Filter,
  CalendarCheck,
  BookOpen,
  Headphones,
  Cog,
  Globe,
  SearchCheck,
  Bot,
  Rocket,
  TrendingUp,
  Star,
  UserCheck,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import HeroScanBar from "@/components/HeroScanBar";
import CTABand from "@/components/CTABand";

const steps = [
  {
    n: "1",
    title: "Scan",
    desc: "We analyze your website in 60 seconds.",
    icon: Globe,
  },
  {
    n: "2",
    title: "Discover",
    desc: "Get your AI readiness score and top opportunities.",
    icon: SearchCheck,
  },
  {
    n: "3",
    title: "Retrofit",
    desc: "We add the right AI capabilities to your website.",
    icon: Bot,
  },
  {
    n: "4",
    title: "Automate",
    desc: "AI works 24/7 to engage, qualify and support customers.",
    icon: Rocket,
  },
  {
    n: "5",
    title: "Grow",
    desc: "More leads, more sales, happier customers, less manual work.",
    icon: TrendingUp,
  },
];

const features = [
  {
    icon: MessageCircle,
    title: "AI Conversations",
    desc: "Engage visitors instantly and keep the conversation going.",
  },
  {
    icon: Filter,
    title: "More Qualified Leads",
    desc: "AI qualifies and captures leads that are ready to buy.",
  },
  {
    icon: CalendarCheck,
    title: "Automated Bookings",
    desc: "Let AI handle scheduling so you never miss an opportunity.",
  },
  {
    icon: BookOpen,
    title: "Smart Knowledge",
    desc: "AI answers questions using your content and documents.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Deliver instant support without increasing your workload.",
  },
  {
    icon: Cog,
    title: "Business Automation",
    desc: "AI connects with your tools and automates what slows you down.",
  },
];

const logos = [
  "Hospitality Group",
  "Cura Health",
  "Modern Retail",
  "Summit Consulting",
  "EduFuture",
  "Prime Properties",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink pb-20 pt-16 sm:pt-24">
        <div className="container-page relative">
          {/* Decorative floating chips — only shown where there's real room */}
          <div className="pointer-events-none absolute left-0 top-8 hidden w-64 flex-col gap-4 xl:flex">
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/15">
                <MessageCircle size={15} className="text-violet" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Answers</span>
            </div>
            <div className="card-dark w-56 rounded-2xl p-3.5">
              <p className="text-xs text-white/80">
                🤖 Hi! I&apos;m your AI Assistant.
              </p>
              <p className="mt-1 text-xs text-white/80">How can I help you today?</p>
              <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-navy-700 px-2.5 py-2">
                <span className="flex-1 text-[11px] text-mist">Ask me anything...</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-azure">
                  <ArrowUpRight size={11} className="text-white" />
                </span>
              </div>
            </div>
            <div className="card-dark flex items-center gap-2 self-start rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/15">
                <Star size={15} className="text-pink-400" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Recommends</span>
            </div>
          </div>

          <div className="pointer-events-none absolute right-0 top-8 hidden w-56 flex-col items-end gap-4 xl:flex">
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15">
                <UserCheck size={15} className="text-azure" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Qualifies</span>
            </div>
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/15">
                <CalendarCheck size={15} className="text-orange-400" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Books</span>
            </div>
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/15">
                <Zap size={15} className="text-violet" />
              </span>
              <span className="text-xs font-medium text-white/85">AI Takes Action</span>
            </div>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Turn your website into an AI business engine</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              Your Website.
              <br />
              Now <span className="bg-brand-gradient bg-clip-text text-transparent">Intelligent.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-mist">
              TechWokx adds an AI layer to your website so it can understand,
              engage and help your customers 24/7.
            </p>
          </div>

          <div className="relative mx-auto mt-10 max-w-2xl">
            <HeroScanBar />
            <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm italic text-violet/80">
              <span aria-hidden>↴</span> It&apos;s fast, free and simple!
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-mist">
              Trusted by forward-thinking businesses
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
              {logos.map((logo) => (
                <span key={logo} className="text-sm font-semibold text-white/70">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 text-navy">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              From Website to AI Business Engine
            </h2>
            <p className="mt-3 text-slate-500">
              We make it simple to add intelligence that drives real results.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.n} className="relative">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
                    <step.icon size={22} strokeWidth={1.75} className="text-violet-600" />
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-bold text-violet-600">
                      {step.n}. {step.title}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <span className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 text-violet-300 lg:block">
                    ›
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-ink py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">What you get</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              A Smarter Website. A Stronger Business.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-dark flex flex-col gap-3 rounded-xl p-6 transition hover:border-violet/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-violet/30 bg-navy-600">
                  <f.icon size={20} strokeWidth={1.75} color="url(#icon-gradient)" />
                </div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-mist">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        heading="Ready to See Your"
        highlight="AI Opportunity?"
        subtext="Join businesses across Ghana and beyond discovering the power of AI."
        buttonLabel="Scan My Website Now"
      />
    </>
  );
}
