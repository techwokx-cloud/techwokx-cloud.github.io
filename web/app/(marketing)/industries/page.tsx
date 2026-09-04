import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "AI By Industry — Hospitality, Healthcare, Retail, Real Estate & More",
  description:
    "TechWokx adapts AI to your industry: Hospitality, Healthcare, Retail & E-commerce, Professional Services, Education and Real Estate — each with its own AI assistant setup.",
  alternates: { canonical: "/industries" },
  openGraph: { url: "/industries", title: "AI That Understands Your Industry | TechWokx" },
};

const industryZones = [
  { label: "Hospitality", left: "0%", width: "33.333%" },
  { label: "Healthcare", left: "33.333%", width: "33.333%" },
  { label: "Retail & E-commerce", left: "66.666%", width: "33.334%" },
];

const industryZones2 = [
  { label: "Professional Services", left: "0%", width: "33.333%" },
  { label: "Education", left: "33.333%", width: "33.333%" },
  { label: "Real Estate", left: "66.666%", width: "33.334%" },
];

export default function IndustriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink py-14">
        <div className="container-page">
          <Reveal variant="scale">
            <img
              src="/mockups/industry-hero.png"
              alt="AI That Understands Your Industry — TechWokx adapts AI to Hospitality, Healthcare, Retail & E-commerce, Professional Services, Education and Real Estate"
              className="mx-auto w-full max-w-5xl"
              style={{ aspectRatio: "1018 / 404" }}
            />
          </Reveal>
        </div>
      </section>

      {/* Industry cards — clickable regions over the real card images,
          each jumping to the homepage scan section. */}
      <section className="py-16" style={{ backgroundColor: "rgb(247,247,250)" }}>
        <div className="container-page">
          <Reveal variant="scale">
            <div className="relative mx-auto w-full max-w-5xl">
              <img
                src="/mockups/industry-solutions-1.png"
                alt="AI Solutions For Your Industry — Hospitality, Healthcare, Retail & E-commerce"
                className="w-full"
                style={{ aspectRatio: "1024 / 454" }}
              />
              {industryZones.map((z) => (
                <Link
                  key={z.label}
                  href="/#scan"
                  aria-label={`Scan my website for ${z.label}`}
                  className="focus-ring absolute inset-y-0 transition hover:bg-black/5"
                  style={{ left: z.left, width: z.width }}
                />
              ))}
            </div>
          </Reveal>

          <Reveal variant="scale" delay={150}>
            <div className="relative mx-auto mt-6 w-full max-w-5xl">
              <img
                src="/mockups/industry-solutions-2.png"
                alt="AI Solutions For Your Industry — Professional Services, Education, Real Estate. Don't see your industry? TechWokx can help any website."
                className="w-full"
                style={{ aspectRatio: "1024 / 444" }}
              />
              {industryZones2.map((z) => (
                <Link
                  key={z.label}
                  href="/#scan"
                  aria-label={`Scan my website for ${z.label}`}
                  className="focus-ring absolute top-0 transition hover:bg-black/5"
                  style={{ left: z.left, width: z.width, height: "83%" }}
                />
              ))}
              <Link
                href="/#scan"
                aria-label="Don't see your industry — scan my website"
                className="focus-ring absolute inset-x-0 bottom-0 transition hover:bg-black/5"
                style={{ height: "17%" }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
