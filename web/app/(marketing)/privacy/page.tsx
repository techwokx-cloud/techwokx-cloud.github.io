import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - TechWokx',
  description: 'Privacy Policy for TechWokx AI website scanning and analysis services.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-ink text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-navy-900 py-16">
        <div className="container-page">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-mist">Last updated: October 8, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-page py-20">
        <div className="max-w-3xl">
          {/* Introduction */}
          <div className="card-dark mb-12 rounded-xl border border-violet/20 bg-navy-800 p-6 sm:p-8">
            <p className="text-base leading-relaxed text-white/90">
              <strong>TechWokx AI Solutions</strong> ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI website scanning services.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">1.1 Information You Provide Directly</h3>
              <ul className="mt-4 space-y-3 text-mist">
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span><strong>Website Scan Information:</strong> When you submit your website URL for AI scanning, we collect and analyze the content of your website to generate an AI Readiness Score and recommendations.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span><strong>Contact Information:</strong> Name, email address, phone number, company name, and other details you provide through contact forms or inquiries.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span><strong>Communication Data:</strong> Correspondence, emails, messages, and feedback you send to us.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">1.2 Information Collected Automatically</h3>
              <ul className="mt-4 space-y-3 text-mist">
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span><strong>Log Data:</strong> IP address, browser type, operating system, referring URLs, and pages visited.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance user experience and analyze website traffic.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span><strong>Device Information:</strong> Device type, unique identifiers, and mobile network information.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span><strong>Usage Analytics:</strong> How you interact with our services, scan results viewed, and features used.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">1.3 Website Content & Analysis</h3>
              <p className="mt-2 text-mist">When you submit a website for scanning, we may access and analyze:</p>
              <ul className="mt-3 space-y-2 text-mist">
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Publicly available content on your website</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Meta tags, headings, and structured data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Contact forms and calls-to-action</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Navigation structure and user journey elements</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
            <ul className="mt-6 space-y-3 text-mist">
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Provide and improve our AI scanning services</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Generate personalized AI Readiness Scores and recommendations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Respond to inquiries and provide customer support</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Send marketing communications (with your consent)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Analyze usage patterns to enhance our services</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Comply with legal obligations and prevent fraud</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">3. Data Sharing & Disclosure</h2>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">3.1 Third-Party Service Providers</h3>
              <p className="mt-2 text-mist">We may share your information with trusted third parties who assist us in operating our website and providing services, including:</p>
              <ul className="mt-3 space-y-2 text-mist">
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Cloud hosting providers</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Email service providers</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>Analytics platforms</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-violet">•</span>
                  <span>AI and machine learning services</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">3.2 Legal Requirements</h3>
              <p className="mt-2 text-mist">We may disclose information when required by law or when we believe in good faith that disclosure is necessary to protect rights, prevent fraud, or ensure security.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
            <p className="text-mist">We implement industry-standard security measures including:</p>
            <ul className="mt-4 space-y-3 text-mist">
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Encrypted data transmission (SSL/TLS)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Secure data storage protocols</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Regular security audits</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Access controls and authentication</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-mist/70">Note: No method of transmission is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">5. Your Privacy Rights</h2>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white/90">5.1 Access & Portability</h3>
                <p className="mt-2 text-mist">You have the right to request a copy of the personal information we hold about you in a portable format.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">5.2 Correction & Update</h3>
                <p className="mt-2 text-mist">You may request correction or updates to inaccurate information in your account.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">5.3 Deletion</h3>
                <p className="mt-2 text-mist">You have the right to request deletion of your personal data, subject to legal retention requirements.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">5.4 Opt-Out</h3>
                <p className="mt-2 text-mist">You may opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.</p>
              </div>
            </div>
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
