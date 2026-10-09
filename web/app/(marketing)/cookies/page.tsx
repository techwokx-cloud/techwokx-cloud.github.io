import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookies Policy - TechWokx',
  description: 'How TechWokx uses cookies and similar tracking technologies.',
};

export default function CookiesPolicy() {
  return (
    <main className="min-h-screen bg-ink text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-navy-900 py-16">
        <div className="container-page">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Cookies Policy</h1>
          <p className="mt-2 text-mist">Last updated: October 9, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-page py-20">
        <div className="max-w-3xl">
          {/* Introduction */}
          <div className="card-dark mb-12 rounded-xl border border-violet/20 bg-navy-800 p-6 sm:p-8">
            <p className="leading-relaxed text-white/90">
              <strong>TechWokx</strong> ("we," "us," "our," or "Company") uses cookies and similar tracking technologies on techwokx.online to enhance your browsing experience, analyze site performance, and deliver personalized content. This Cookies Policy explains what cookies are, how we use them, and how you can manage them.
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">1. What Are Cookies?</h2>
            <p className="mt-4 text-mist">Cookies are small text files stored on your device (computer, tablet, or mobile phone) when you visit a website. They contain information about your browsing activity and preferences. Cookies serve several purposes:</p>
            <ul className="mt-4 space-y-2 text-mist">
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Remembering login information and preferences</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Understanding how visitors use our website</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Personalizing your experience</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Measuring the effectiveness of marketing campaigns</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span>Improving website functionality and security</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">2. Types of Cookies We Use</h2>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.1 Essential Cookies</h3>
              <p className="mt-2 text-mist">These cookies are necessary for the website to function properly. They enable basic features such as page navigation and access to secure areas.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.2 Performance & Analytics Cookies</h3>
              <p className="mt-2 text-mist">These cookies help us understand how visitors interact with our website. They collect anonymous data about pages visited, time spent on pages, and user journeys.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.3 Preference & Functionality Cookies</h3>
              <p className="mt-2 text-mist">These cookies remember your choices and preferences to provide a personalized experience. They may store information about your language preferences or theme selections.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.4 Marketing & Advertising Cookies</h3>
              <p className="mt-2 text-mist">These cookies are used to track your browsing habits and deliver personalized advertisements. We use Meta Pixel and other advertising platforms to measure campaign performance.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">2.5 Third-Party Cookies</h3>
              <p className="mt-2 text-mist">Third-party cookies are set by domains other than the one you're visiting. We allow trusted third parties such as Google, Meta, and analytics providers to set cookies on our site.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">3. How We Use Cookie Data</h2>
            <ul className="mt-6 space-y-3 text-mist">
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><strong>Session Management:</strong> Keeping you logged in and maintaining your browsing session</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><strong>Analytics:</strong> Understanding visitor behavior and website traffic patterns</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><strong>Personalization:</strong> Customizing your experience based on your preferences</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><strong>Marketing:</strong> Measuring ad campaign effectiveness and delivering targeted content</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><strong>Security:</strong> Preventing fraud and protecting against unauthorized access</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><strong>Performance:</strong> Optimizing website speed and functionality</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">4. Your Cookie Choices</h2>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">4.1 Browser Settings</h3>
              <p className="mt-2 text-mist">Most web browsers allow you to control cookies through their settings. You can accept or reject all cookies, receive notifications, or delete cookies from your device.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">4.2 Cookie Consent</h3>
              <p className="mt-2 text-mist">When you first visit techwokx.online, you will be presented with a cookie consent banner. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white/90">4.3 Impact of Disabling Cookies</h3>
              <p className="mt-2 text-mist">If you disable essential cookies, some features of techwokx.online may not work properly. Disabling marketing and analytics cookies will not affect website functionality.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">5. Data Security</h2>
            <p className="mt-4 text-mist">We implement industry-standard security measures to protect cookie data, including encryption and secure transmission protocols (HTTPS). However, no transmission over the internet is completely secure.</p>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">6. International Considerations</h2>
            <p className="mt-4 text-mist">Depending on your location, different data protection laws may apply. If you are located in the European Union, the General Data Protection Regulation (GDPR) requires explicit consent before non-essential cookies are set. We comply with all applicable international data protection regulations.</p>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">7. Updates to This Policy</h2>
            <p className="mt-4 text-mist">We may update this Cookies Policy periodically to reflect changes in our cookie practices or applicable laws. We will notify you of material changes by updating the "Last updated" date at the top of this page.</p>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white">8. Related Policies</h2>
            <p className="mt-4 text-mist">For more information about how we handle your data, please review our:</p>
            <ul className="mt-4 space-y-2 text-mist">
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><Link href="/privacy" className="text-violet hover:underline">Privacy Policy</Link> — How we collect, use, and protect your personal information</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet">•</span>
                <span><Link href="/terms" className="text-violet hover:underline">Terms of Service</Link> — The terms and conditions of using our website and services</span>
              </li>
            </ul>
          </section>

          {/* Contact Section */}
          <section className="rounded-xl border border-violet/20 bg-navy-800 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <p className="mt-3 text-mist">If you have questions about our use of cookies or this Cookies Policy:</p>
            <div className="mt-6 space-y-2 text-sm text-mist">
              <p><strong className="text-white">Email:</strong> <a href="mailto:hello@techwokx.com" className="text-violet hover:underline">hello@techwokx.com</a> | <a href="mailto:techwokx@gmail.com" className="text-violet hover:underline">techwokx@gmail.com</a></p>
              <p><strong className="text-white">Phone:</strong> +233 55 508 7407</p>
            <p><strong className="text-white">Location:</strong> Accra, Ghana</p>
              
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
