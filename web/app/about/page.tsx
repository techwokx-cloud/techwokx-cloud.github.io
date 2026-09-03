import {
  BrainCircuit,
  Users,
  Layout,
  TrendingUp,
  Search,
  Wrench,
  Rocket,
} from "lucide-react";
import CTABand from "@/components/CTABand";

const traditional = ["Information", "Visitor", "Finds information", "Contact form", "Human responds"];
const aiPowered = [
  "Visitor",
  "AI understands intent",
  "AI answers",
  "AI recommends",
  "AI qualifies",
  "AI takes action",
];

const philosophy = [
  {
    icon: Search,
    title: "Scan",
    desc: "Discover the opportunity hiding inside your existing website.",
  },
  {
    icon: Wrench,
    title: "Retrofit",
    desc: "Add the right AI capabilities without a rebuild.",
  },
  {
    icon: Rocket,
    title: "Grow",
    desc: "Turn intelligence into leads, sales and time saved.",
  },
];

const why = [
  { icon: BrainCircuit, title: "AI-Native", desc: "Built with AI at the core, not bolted on as an afterthought." },
  { icon: Users, title: "Business-Focused", desc: "Every capability is judged by the business impact it creates." },
  { icon: Layout, title: "Built Around Your Existing Website", desc: "No rebuild required — we enhance what you already have." },
  { icon: TrendingUp, title: "Designed To Grow With You", desc: "Start with one agent. Add more as your business scales." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              The Web Is Changing.
              <br />
              Businesses Should{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Too.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-mist">
              We transform ordinary business websites into intelligent
              business systems that understand, engage and deliver results.
            </p>
            <a
              href="/#scan"
              className="btn-gradient focus-ring mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
            >
              Scan My Website →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="card-dark rounded-xl p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist">
                Your website today
              </p>
              <ol className="space-y-2.5">
                {traditional.map((step, i) => (
                  <li key={step} className="flex items-center gap-2 text-white/80">
                    <span className="text-mist">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="card-dark rounded-xl border-violet/30 bg-navy-600 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet">
                With TechWokx AI
              </p>
              <ol className="space-y-2.5">
                {aiPowered.map((step, i) => (
                  <li key={step} className="flex items-center gap-2 text-white/90">
                    <span className="text-violet">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our mission</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Make every business website intelligent enough to understand,
            engage and help its customers.
          </h2>
        </div>
      </section>

      <section className="bg-navy-800 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Our approach</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Simple. Practical. Powerful.
            </h2>
          </div>
          <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 sm:block" />
            {philosophy.map((p) => (
              <div key={p.title} className="relative flex flex-col items-center text-center">
                <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full border border-violet/40 bg-navy-700">
                  <p.icon size={26} className="text-violet" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
                <p className="mt-1.5 max-w-[220px] text-sm text-mist">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Why TechWokx?</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              A Different Way To Build AI Into Your Business
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <div key={w.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-violet/30 bg-navy-600">
                  <w.icon size={24} className="text-violet" />
                </div>
                <h3 className="mt-4 font-semibold">{w.title}</h3>
                <p className="mt-1.5 text-sm text-mist">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-3 text-3xl font-extrabold">
              We&apos;re a small team with a big mission.
            </h2>
            <p className="mt-4 text-slate-500">
              TechWokx was created to help businesses unlock the hidden
              potential inside their websites using AI.
            </p>
            <p className="mt-3 text-slate-500">
              We believe every business — big or small — deserves a website
              that works as hard as they do. That&apos;s why we keep things
              simple, practical and focused on real outcomes.
            </p>
            <p className="mt-5 font-semibold text-navy">The TechWokx Team</p>
            <p className="text-sm text-slate-500">
              Builders. Problem solvers. AI enthusiasts.
            </p>
          </div>
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100">
            <span className="text-sm font-medium text-navy/40">
              Team photo placeholder
            </span>
          </div>
        </div>
      </section>

      <CTABand
        heading="Ready To Transform"
        highlight="Your Website?"
        subtext="Discover your AI opportunities in just 60 seconds."
      />
    </>
  );
}
