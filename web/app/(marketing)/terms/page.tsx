import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - TechWokx',
  description: 'Terms of Service for TechWokx AI website scanning and analysis services.',
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-ink text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-navy-900 py-16">
        <div className="container-page">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Terms of Service</h1>
          <p className="mt-2 text-mist">Last updated: October 8, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-page py-20">
        <div className="max-w-3xl">
          {/* Introduction */}
          <div className="card-dark mb-12 rounded-xl border border-violet/20 bg-navy-800 p-6 sm:p-8">
            <p className="text-base font-semibold text-white">PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING TECHWOKX SERVICES.</p>
            <p className="mt-3 leading-relaxed text-white/90">
              By accessing or using techwokx.online and our AI website scanning services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">1. Use License</h2>
            <p className="mt-4 text-mist">The Company grants you a limited, non-exclusive, non-transferable, revocable license to access and use our website and services. You agree not to:</p>
            <ul className="mt-4 space-y-3 text-mist">
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Reproduce, duplicate, copy, sell, or resell any portion of our services</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Modify, reverse engineer, or hack our systems</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Access our services through automated scripts or bots</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Use our services for unlawful purposes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Attempt to gain unauthorized access to our systems</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Submit malware, viruses, or malicious code</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">2. User Responsibilities</h2>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.1 Accuracy of Information</h3>
              <p className="mt-2 text-mist">You are responsible for ensuring that all information you provide is accurate and current. You grant the Company permission to access and analyze your submitted website for scan purposes.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.2 Website Submission</h3>
              <p className="mt-2 text-mist">By submitting a website URL for scanning:</p>
              <ul className="mt-3 space-y-2 text-mist">
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>You confirm you own or have authorization to analyze that website</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>You authorize the Company to access and analyze publicly available content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>You understand this analysis is for informational purposes only</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.3 Account Security</h3>
              <p className="mt-2 text-mist">If you create an account, you are responsible for maintaining the confidentiality of login credentials. You agree to notify us immediately of any unauthorized access.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">3. Limitations of Service</h2>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">3.1 AI Readiness Score Disclaimer</h3>
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
                <p className="font-semibold">⚠ IMPORTANT:</p>
                <p className="mt-2 text-sm">AI Readiness Scores and recommendations are generated by artificial intelligence and are informational only. They are NOT:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Guarantees of business results or outcomes</li>
                  <li>• Professional consulting or business advice</li>
                  <li>• Binding recommendations or requirements</li>
                  <li>• Assessments of website functionality or security</li>
                </ul>
                <p className="mt-3 text-sm">You should consult with professional advisors before acting on any recommendations.</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">3.2 Accuracy & Availability</h3>
              <p className="mt-2 text-mist">While we strive for accuracy, we do not warrant that:</p>
              <ul className="mt-3 space-y-2 text-mist">
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Scan results are 100% accurate or complete</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Services will be uninterrupted or error-free</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>All website elements will be properly analyzed</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">4. Intellectual Property Rights</h2>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">4.1 Company Content</h3>
              <p className="mt-2 text-mist">All website design, text, graphics, logos, and software are the exclusive property of TechWokx AI Solutions. You may not reproduce, distribute, or transmit this content without our express written permission.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">4.2 User Content</h3>
              <p className="mt-2 text-mist">By submitting your website for scanning, you grant the Company a worldwide, non-exclusive, royalty-free license to analyze, process, generate reports, and use anonymized data for service improvement.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">4.3 Scan Reports</h3>
              <p className="mt-2 text-mist">Scan reports are provided for your personal use. You may not redistribute, sell, or publicly disclose reports without our permission.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">5. Disclaimer & Limitation of Liability</h2>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">5.1 "As-Is" Service</h3>
              <p className="mt-2 text-mist">Our services are provided "AS-IS" without warranties of any kind. The Company disclaims all express and implied warranties, including merchantability and fitness for a particular purpose.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">5.2 Limitation of Liability</h3>
              <p className="mt-2 text-mist">To the maximum extent permitted by law, the Company shall not be liable for indirect, incidental, special, consequential, or punitive damages, loss of profits, data, or goodwill, or any damages arising from your reliance on our services.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">6. Acceptable Use Policy</h2>
            <p className="mt-4 text-mist">You agree not to:</p>
            <ul className="mt-4 space-y-3 text-mist">
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Submit websites for scanning for malicious or deceptive purposes</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Scan competitors' websites without authorization</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Spam, phish, or attempt social engineering attacks</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Share login credentials or allow unauthorized account access</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Submit false or misleading information</span>
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">7. Privacy & Data Protection</h2>
            <p className="mt-4 text-mist">Your use of our services is governed by our <Link href="/privacy" className="text-violet hover:underline">Privacy Policy</Link>. By using our services, you consent to our collection and use of information as described in that policy.</p>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">8. Governing Law & Dispute Resolution</h2>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">8.1 Governing Law</h3>
              <p className="mt-2 text-mist">These Terms of Service are governed by and construed in accordance with the laws of Ghana, without regard to its conflict of law principles.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">8.2 Dispute Resolution</h3>
              <p className="mt-2 text-mist">Any disputes arising from these Terms shall be resolved through good faith negotiation, mediation, and if necessary, binding arbitration or litigation.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">9. Amendments</h2>
            <p className="mt-4 text-mist">The Company may amend these Terms of Service at any time. Continued use of our services constitutes acceptance of amended terms. We recommend reviewing these terms periodically.</p>
          </section>

          {/* Footer Links */}
          <div className="mt-12 flex gap-4 border-t border-white/10 pt-8 text-sm">
            <Link href="/" className="text-mist hover:text-white">Home</Link>
            <span className="text-white/20">•</span>
            <Link href="/privacy" className="text-mist hover:text-white">Privacy Policy</Link>
            <span className="text-white/20">•</span>
            <Link href="/terms" className="text-mist hover:text-white">Terms of Service</Link>
            <span className="text-white/20">•</span>
            <Link href="/cookies" className="text-mist hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
