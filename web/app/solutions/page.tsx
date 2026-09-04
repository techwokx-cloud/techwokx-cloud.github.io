import {
  Bot,
  MessageCircle,
  Zap,
  UserRound,
  ShoppingCart,
  Users,
  Smile,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import CTABand from "@/components/CTABand";

export default function SolutionsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient-radial bg-ink py-20">
        <div className="container-page relative">
          <div className="pointer-events-none absolute left-0 top-10 hidden w-52 flex-col gap-4 xl:flex">
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azure/15">
                <Users size={15} className="text-azure" />
              </span>
              <span className="text-xs font-medium text-white/85">Website Visitors</span>
            </div>
            <div className="card-dark flex items-center gap-2 self-start rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/15">
                <Bot size={15} className="text-violet" />
              </span>
              <span className="text-xs font-medium text-white/85">
                AI Understands &amp; Engages
              </span>
            </div>
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/15">
                <Zap size={15} className="text-violet" />
              </span>
              <span className="text-xs font-medium text-white/85">
                AI Takes Action &amp; Delivers
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute right-0 top-10 hidden w-48 flex-col items-end gap-4 xl:flex">
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/15">
                <UserRound size={15} className="text-fuchsia-400" />
              </span>
              <span className="text-xs font-medium text-white/85">More Leads</span>
            </div>
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/15">
                <ShoppingCart size={15} className="text-violet" />
              </span>
              <span className="text-xs font-medium text-white/85">More Sales</span>
            </div>
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15">
                <Smile size={15} className="text-amber-400" />
              </span>
              <span className="text-xs font-medium text-white/85">Happy Customers</span>
            </div>
            <div className="card-dark flex items-center gap-2 rounded-full py-2 pl-2.5 pr-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
                <TrendingUp size={15} className="text-emerald-400" />
              </span>
              <span className="text-xs font-medium text-white/85">Business Growth</span>
            </div>
          </div>

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
            <div className="relative mt-10 flex justify-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient shadow-glow">
                <div className="absolute inset-0 animate-pulse rounded-full bg-brand-gradient opacity-40 blur-md" />
                <Sparkles size={22} className="relative text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-navy">
        <div className="container-page">
          <img
            src="/mockups/ai-delivers.png"
            alt="AI That Delivers Real Business Outcomes: Generate More Leads, Increase Sales, Automate Support, Automate Bookings, Unlock Knowledge, Automate Operations"
            className="mx-auto w-full max-w-4xl"
            style={{ aspectRatio: "927 / 598" }}
          />
        </div>
      </section>

      <section className="bg-gradient-to-b from-violet-50 to-indigo-50 py-20">
        <div className="container-page">
          <img
            src="/mockups/from-visitors.png"
            alt="From Visitor To Business Outcome: Visitor, AI Understands, AI Engages, AI Qualifies, AI Acts, Business Outcome"
            className="mx-auto w-full max-w-4xl"
            style={{ aspectRatio: "889 / 174" }}
          />
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
