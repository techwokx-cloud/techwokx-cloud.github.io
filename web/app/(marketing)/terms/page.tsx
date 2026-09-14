import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of TechWokx's website and AI services.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>

      <div className="prose-content mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
        <p>
          These Terms govern your use of techwokx.online and the AI services we provide (&quot;Service&quot;). By
          using the Service, you agree to these Terms.
        </p>

        <section>
          <h2 className="text-xl font-bold text-navy">1. Description of Service</h2>
          <p className="mt-3">
            TechWokx provides AI tools — website scanning, AI chat assistants, lead capture, and booking — that
            businesses add to their own websites, along with related marketing automation services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">2. Use of the Free Scanner</h2>
          <p className="mt-3">
            Our free website scan analyzes publicly available information about a website you submit. You confirm
            you have the right to request a scan of the URL you submit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">3. Paid Services</h2>
          <p className="mt-3">
            AI Assistant, AI Business, and AI Business Platform packages are one-time project fees unless otherwise
            agreed in writing. Custom website builds may include ongoing hosting and AI usage fees starting in Year
            2, as disclosed at the time of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">4. Acceptable Use</h2>
          <p className="mt-3">You agree not to use the Service to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Submit unlawful, harmful, or abusive content to our AI assistants.</li>
            <li>Attempt to interfere with, disrupt, or reverse-engineer the Service.</li>
            <li>Use the Service to send unsolicited bulk communications.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">5. Intellectual Property</h2>
          <p className="mt-3">
            The TechWokx name, logo, and website content are our property. Custom work delivered as part of a paid
            project belongs to the client upon full payment, unless otherwise agreed in writing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">6. Disclaimers</h2>
          <p className="mt-3">
            The Service, including AI-generated content and recommendations, is provided &quot;as is&quot; without
            warranties of any kind. AI outputs may occasionally be inaccurate; you are responsible for reviewing
            content before relying on or publishing it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">7. Limitation of Liability</h2>
          <p className="mt-3">
            To the fullest extent permitted by law, TechWokx is not liable for indirect, incidental, or
            consequential damages arising from use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">8. Termination</h2>
          <p className="mt-3">
            We may suspend or terminate access to the Service for violations of these Terms. You may stop using the
            Service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">9. Governing Law</h2>
          <p className="mt-3">These Terms are governed by the laws of Ghana.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">10. Changes to These Terms</h2>
          <p className="mt-3">
            We may update these Terms from time to time. Continued use of the Service after changes constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">11. Contact Us</h2>
          <p className="mt-3">
            TechWokx AI Solutions, Accra, Ghana
            <br />
            Email:{" "}
            <a href="mailto:techwokx@gmail.com" className="text-violet-600 underline">
              techwokx@gmail.com
            </a>
          </p>
        </section>

        <p className="text-xs text-slate-400">
          This document is provided for general transparency and Meta platform compliance. It is not a substitute
          for legal advice specific to your jurisdiction.
        </p>
      </div>
    </div>
  );
}
