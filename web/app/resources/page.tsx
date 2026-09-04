import Link from "next/link";
import {
  BookOpen,
  Lightbulb,
  Users,
  Gauge,
  User,
  MonitorSmartphone,
  Mail,
  ArrowRight,
} from "lucide-react";
import CTABand from "@/components/CTABand";
import NewsletterForm from "@/components/NewsletterForm";
import ScoreRing from "@/components/ScoreRing";

const guides = [
  {
    tag: "GUIDE",
    time: "7 min read",
    title: "The Complete Guide to AI-Powered Websites",
    desc: "Everything you need to know about adding AI to your existing website.",
    tone: "from-violet-600/30 to-blue-600/20",
  },
  {
    tag: "GUIDE",
    time: "6 min read",
    title: "7 AI Agents Every Business Website Needs",
    desc: "The must-have AI capabilities that drive leads, sales and customer satisfaction.",
    tone: "from-emerald-500/25 to-blue-600/15",
  },
  {
    tag: "GUIDE",
    time: "5 min read",
    title: "From Chat to Customer: The AI Engagement Flow",
    desc: "How AI conversations turn visitors into qualified leads and customers.",
    tone: "from-violet-600/30 to-fuchsia-500/15",
  },
  {
    tag: "GUIDE",
    time: "8 min read",
    title: "Measuring the ROI of AI on Your Website",
    desc: "Track what matters and see the real impact of AI on your business.",
    tone: "from-blue-600/25 to-navy-500/10",
  },
];

const insights = [
  {
    tag: "INSIGHT",
    time: "5 min read",
    title: "AI in 2026: What Business Owners Need to Know",
    desc: "Key trends, opportunities and what to expect this year.",
  },
  {
    tag: "INSIGHT",
    time: "4 min read",
    title: "Why Your Website Visitors Aren't Converting",
    desc: "Common gaps and how AI solves them.",
  },
  {
    tag: "INSIGHT",
    time: "6 min read",
    title: "The Rise of AI Customer Expectations",
    desc: "What today's customers expect and how to meet them.",
  },
  {
    tag: "INSIGHT",
    time: "5 min read",
    title: "AI Automation: Small Business, Big Impact",
    desc: "How small teams can achieve enterprise-level results.",
  },
];

const caseStudies = [
  {
    tag: "CASE STUDY",
    title: "Luxury Resort Increases Bookings",
    stats: [
      { value: "+42%", label: "More Bookings" },
      { value: "+32%", label: "Support Requests" },
      { value: "3.4x", label: "ROI in 90 Days" },
    ],
  },
  {
    tag: "CASE STUDY",
    title: "E-commerce Store Boosts Sales",
    stats: [
      { value: "+58%", label: "More Sales" },
      { value: "+27%", label: "AOV Increase" },
      { value: "2.8x", label: "ROI in 60 Days" },
    ],
  },
  {
    tag: "CASE STUDY",
    title: "Clinic Reduces No-Shows",
    stats: [
      { value: "-41%", label: "No-Shows" },
      { value: "+35%", label: "Appointments" },
      { value: "4.1x", label: "ROI in 90 Days" },
    ],
  },
  {
    tag: "CASE STUDY",
    title: "Agency Improves Lead Quality",
    stats: [
      { value: "+67%", label: "Qualified Leads" },
      { value: "-45%", label: "Manual Work" },
      { value: "3.7x", label: "ROI in 60 Days" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Learn What AI Can Do For{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Your Business.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-mist">
              Practical guides, insights and real examples to help you turn
              your website into an intelligent business engine.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
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
          <div className="flex flex-col gap-3">
            {[
              { icon: BookOpen, label: "AI Knowledge" },
              { icon: Lightbulb, label: "Insights" },
              { icon: Gauge, label: "Case Studies" },
            ].map((c, i) => (
              <div
                key={c.label}
                className="card-dark flex items-center gap-3 rounded-xl px-5 py-4"
                style={{ marginLeft: `${i * 24}px` }}
              >
                <c.icon size={18} className="text-violet" />
                <span className="text-sm font-medium">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured tool: AI Website Scanner */}
      <section className="bg-ink pb-4">
        <div className="container-page">
          <div className="card-dark grid grid-cols-1 gap-8 rounded-2xl border-violet/20 bg-navy-800 p-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="rounded-full bg-violet/15 px-3 py-1 text-xs font-semibold text-violet">
                FEATURED TOOL
              </span>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                AI Website Scanner
              </h2>
              <p className="mt-1 text-mist">Discover Your Best AI Opportunities</p>
              <p className="mt-4 text-sm text-mist">
                Our free 60-second audit analyzes your website and reveals
                where AI can create the biggest impact.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                {["AI Readiness Score", "Top Opportunity Areas", "Personalized Recommendations"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-violet">✓</span> {item}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/#scan"
                className="btn-gradient focus-ring mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
              >
                Scan My Website Now <ArrowRight size={16} />
              </Link>
              <p className="mt-3 text-xs text-mist">
                100% Free · 60 Seconds · No Credit Card
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card-dark col-span-2 flex items-center gap-6 rounded-xl p-5 sm:col-span-1">
                <ScoreRing score={72} size={96} />
                <div>
                  <p className="text-xs font-semibold text-mist">AI WEBSITE AUDIT</p>
                  <p className="text-sm text-white/80">AI Readiness Score</p>
                </div>
              </div>
              <div className="card-dark rounded-xl p-5">
                <p className="text-xs font-semibold text-mist">TOP OPPORTUNITY AREAS</p>
                <ul className="mt-3 space-y-2 text-xs">
                  <li className="flex justify-between"><span>AI Sales</span><span className="text-rose-400">HIGH</span></li>
                  <li className="flex justify-between"><span>AI Support</span><span className="text-rose-400">HIGH</span></li>
                  <li className="flex justify-between"><span>AI Search</span><span className="text-amber-400">MEDIUM</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="bg-ink py-16">
        <div className="container-page">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Guides</h2>
            <Link href="#" className="focus-ring flex items-center gap-1 text-sm text-violet">
              View all guides <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((g) => (
              <article key={g.title} className="card-dark overflow-hidden rounded-xl">
                <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${g.tone}`}>
                  <MonitorSmartphone size={34} className="text-white/70" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded bg-violet/15 px-2 py-0.5 font-semibold text-violet">
                      {g.tag}
                    </span>
                    <span className="text-mist">{g.time}</span>
                  </div>
                  <h3 className="mt-2.5 text-sm font-semibold leading-snug text-white">
                    {g.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-mist">{g.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="bg-ink pb-16">
        <div className="container-page">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Insights</h2>
            <Link href="#" className="focus-ring flex items-center gap-1 text-sm text-violet">
              View all insights <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {insights.map((g) => (
              <article key={g.title} className="card-dark overflow-hidden rounded-xl">
                <div className="flex h-24 items-center justify-center bg-navy-600">
                  <Lightbulb size={26} className="text-violet/70" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded bg-blue-500/15 px-2 py-0.5 font-semibold text-azure">
                      {g.tag}
                    </span>
                    <span className="text-mist">{g.time}</span>
                  </div>
                  <h3 className="mt-2.5 text-sm font-semibold leading-snug text-white">
                    {g.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-mist">{g.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-ink pb-16">
        <div className="container-page">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Case Studies</h2>
            <Link href="#" className="focus-ring flex items-center gap-1 text-sm text-violet">
              View all case studies <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {caseStudies.map((c) => (
              <article key={c.title} className="card-dark overflow-hidden rounded-xl">
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-navy-600 to-navy-800">
                  <User size={30} className="text-violet/60" />
                </div>
                <div className="p-4">
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                    {c.tag}
                  </span>
                  <h3 className="mt-2.5 text-sm font-semibold leading-snug text-white">
                    {c.title}
                  </h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                    {c.stats.map((s) => (
                      <div key={s.label}>
                        <p className="text-sm font-bold text-white">{s.value}</p>
                        <p className="text-[10px] leading-tight text-mist">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* From curiosity to action */}
      <section className="bg-navy-800 py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            From Curiosity To Action.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {["Learn", "Discover", "Scan", "Transform"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-violet/30 bg-navy-700 text-lg font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm text-white/80">{step}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight size={18} className="text-mist" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-10">
        <div className="container-page">
          <div className="card-dark flex flex-col items-center gap-3 rounded-2xl p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-violet" />
              <div>
                <h3 className="font-semibold">Get AI insights in your inbox</h3>
                <p className="text-sm text-mist">One practical tip a month. No spam.</p>
              </div>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <CTABand
        heading="Ready to See What AI Can Do For"
        highlight="Your Website?"
        subtext="Scan your website and get your free AI audit in 60 seconds."
      />
    </>
  );
}
