import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Bot } from "lucide-react";

export default function CTABand({
  heading,
  highlight,
  subtext,
  buttonLabel = "Scan My Website",
}: {
  heading: string;
  highlight?: string;
  subtext: string;
  buttonLabel?: string;
}) {
  return (
    <section className="bg-ink py-16 sm:py-20">
      <div className="container-page">
        <div className="card-dark flex flex-col items-center gap-8 rounded-2xl border-white/10 bg-navy-800 px-6 py-10 text-center sm:px-10 xl:flex-row xl:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-violet/30 bg-navy-600">
            <Bot size={36} className="text-violet" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              {heading}{" "}
              {highlight && (
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  {highlight}
                </span>
              )}
            </h3>
            <p className="mt-2 text-mist">{subtext}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-mist xl:justify-start">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-violet" /> 100% Free
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-violet" /> 60-Second Audit
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-violet" /> No Credit Card
              </span>
            </div>
          </div>
          <Link
            href="/#scan"
            className="btn-gradient focus-ring flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-6 py-3.5 text-sm"
          >
            {buttonLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
