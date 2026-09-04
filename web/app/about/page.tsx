import {
  BrainCircuit,
  Users,
  Layout,
  TrendingUp,
  UserX,
  Eye,
  FileSearch,
  Mail,
  UserCheck,
  Bot,
  MessageCircle,
  ThumbsUp,
  ShieldCheck,
  Zap as ZapIcon,
} from "lucide-react";
import TeamIllustration from "@/components/illustrations/TeamIllustration";
import Reveal from "@/components/Reveal";

const traditional = [
  { icon: UserX, label: "Information" },
  { icon: Eye, label: "Visitor" },
  { icon: FileSearch, label: "Finds information" },
  { icon: Mail, label: "Contact form" },
  { icon: UserCheck, label: "Human responds" },
];
const aiPowered = [
  { icon: Eye, label: "Visitor" },
  { icon: Bot, label: "AI understands intent" },
  { icon: MessageCircle, label: "AI answers" },
  { icon: ThumbsUp, label: "AI recommends" },
  { icon: ShieldCheck, label: "AI qualifies" },
  { icon: ZapIcon, label: "AI takes action" },
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
      <section className="py-14" style={{ backgroundColor: "rgb(1,2,10)" }}>
        <div className="container-page">
          <Reveal variant="scale">
            <img
              src="/mockups/about-header.png"
              alt="The Web Is Changing. Businesses Should Too. We transform ordinary business websites into intelligent business systems that understand, engage and deliver results."
              className="mx-auto w-full max-w-5xl"
              style={{ aspectRatio: "1019 / 387" }}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-navy-800 py-16">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="eyebrow">The shift</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                From A Website That Waits To One That Acts
              </h2>
            </div>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <Reveal delay={100}>
              <div className="card-dark rounded-xl p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-mist">
                  Your website today
                </p>
                <ol className="space-y-3">
                  {traditional.map((step) => (
                    <li key={step.label} className="flex items-center gap-2.5 text-white/80">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5">
                        <step.icon size={13} className="text-mist" />
                      </span>
                      {step.label}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <div className="card-dark rounded-xl border-violet/30 bg-navy-600 p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet">
                  With TechWokx AI
                </p>
                <ol className="space-y-3">
                  {aiPowered.map((step) => (
                    <li key={step.label} className="flex items-center gap-2.5 text-white/90">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet/15">
                        <step.icon size={13} className="text-violet" />
                      </span>
                      {step.label}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "rgb(248,249,251)" }}>
        <div className="container-page">
          <Reveal variant="scale">
            <img
              src="/mockups/our-mission.png"
              alt="Our Mission — Make every business website intelligent enough to understand, engage and help its customers. AI-Native, Business-Focused, Built Around Your Existing Website, Designed To Grow With You. Our Approach: Simple. Practical. Powerful. Scan, Retrofit, Automate, Grow."
              className="mx-auto w-full max-w-5xl"
              style={{ aspectRatio: "1022 / 622" }}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Why TechWokx?</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                A Different Way To Build AI Into Your Business
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-violet/30 bg-navy-600">
                    <w.icon size={24} className="text-violet" />
                  </div>
                  <h3 className="mt-4 font-semibold">{w.title}</h3>
                  <p className="mt-1.5 text-sm text-mist">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
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
          </Reveal>
          <Reveal delay={150} variant="scale">
            <div>
              <TeamIllustration />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
