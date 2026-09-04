import {
  Star,
  UserCheck,
  Zap,
  ArrowUpRight,
  MessageCircle,
  CalendarCheck,
} from "lucide-react";
import HeroScanBar from "@/components/HeroScanBar";
import Reveal from "@/components/Reveal";

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
            <Reveal>
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
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div id="scan" className="relative mx-auto mt-10 max-w-2xl scroll-mt-24">
              <HeroScanBar />
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm italic text-violet/80">
                <span aria-hidden>↴</span> It&apos;s fast, free and simple!
              </p>
            </div>
          </Reveal>

          <Reveal delay={300}>
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
    </>
  );
}
