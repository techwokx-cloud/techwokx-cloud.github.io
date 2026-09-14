import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TechWokx collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: September 2026</p>

      <div className="prose-content mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
        <p>
          TechWokx (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) provides AI tools that businesses add to their own
          websites — website scanning, AI chat, lead capture, booking, and related marketing automation. This
          policy explains what we collect, why, and how you can control it.
        </p>

        <section>
          <h2 className="text-xl font-bold text-navy">1. Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Website scan data</strong> — the URL you submit to our free AI Readiness scanner, and the
              resulting technical/content analysis of that public website.
            </li>
            <li>
              <strong>Lead information</strong> — business name, email address, and WhatsApp number, if you submit
              them to request a scan report or contact us.
            </li>
            <li>
              <strong>Chat conversations</strong> — messages you send to and receive from our AI assistant, stored
              so the assistant can maintain context within a conversation and so we can review conversation quality.
            </li>
            <li>
              <strong>Booking/appointment details</strong> — name, contact method, and preferred time, if you
              request a booking through the AI assistant.
            </li>
            <li>
              <strong>Usage and analytics data</strong> — pages visited and general interaction data, collected via
              the Meta Pixel for ad performance measurement.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">2. How We Use Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>To run the website scan and generate your AI Readiness report.</li>
            <li>To respond to inquiries, send your scan report, and follow up by email or WhatsApp.</li>
            <li>To operate the AI chat assistant and improve its responses over time.</li>
            <li>To manage bookings and appointment requests.</li>
            <li>To measure and improve our marketing, including ad performance via Meta Pixel.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">3. Third-Party Services We Use</h2>
          <p className="mt-3">
            We rely on the following processors to operate our service. Each processes data only as needed to
            provide their service to us:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>AI providers (Groq, Google Gemini, Fal.ai) — to generate chat responses and images.</li>
            <li>Resend — to send transactional and follow-up emails.</li>
            <li>Buffer — to schedule and publish social media content.</li>
            <li>Meta (Facebook/Instagram/WhatsApp) — for the Meta Pixel, social channels, and WhatsApp messaging.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">4. Data Retention</h2>
          <p className="mt-3">
            We retain lead, scan, and conversation data for as long as reasonably needed to provide our service and
            maintain business records, or until you request deletion (see below).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">5. Your Rights &amp; Data Deletion</h2>
          <p className="mt-3">
            You can request access to, correction of, or deletion of your personal data at any time by emailing{" "}
            <a href="mailto:techwokx@gmail.com" className="text-violet-600 underline">
              techwokx@gmail.com
            </a>
            . We will confirm your identity and process deletion requests within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">6. Security</h2>
          <p className="mt-3">
            We use industry-standard measures to protect your data, including encrypted connections (HTTPS) and
            access controls on our systems. No method of transmission or storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">7. Children&apos;s Privacy</h2>
          <p className="mt-3">
            Our service is intended for business use and is not directed at children. We do not knowingly collect
            data from individuals under 18.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">8. Changes to This Policy</h2>
          <p className="mt-3">
            We may update this policy from time to time. Material changes will be reflected by updating the date at
            the top of this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-navy">9. Contact Us</h2>
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
          This policy is provided for general transparency and Meta platform compliance. It is not a substitute for
          legal advice specific to your jurisdiction.
        </p>
      </div>
    </div>
  );
}
