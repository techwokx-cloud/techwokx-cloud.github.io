import Link from "next/link";
import { Linkedin, Twitter, Youtube, Facebook, MessageSquare, Mail, Phone, MapPin, ShieldCheck, ChevronRight } from "lucide-react";
import ScanBar from "@/components/ScanBar";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "AI Platform", href: "/solutions" },
      { label: "AI Assistant", href: "/solutions" },
      { label: "AI Sales", href: "/solutions" },
      { label: "AI Support", href: "/solutions" },
      { label: "AI Search", href: "/solutions" },
      { label: "AI Knowledge", href: "/solutions" },
      { label: "AI Booking", href: "/solutions" },
      { label: "AI Automation", href: "/solutions" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Generate More Leads", href: "/solutions#generate-more-leads" },
      { label: "Increase Sales", href: "/solutions#increase-sales" },
      { label: "Automate Support", href: "/solutions#automate-support" },
      { label: "Automate Bookings", href: "/solutions#automate-bookings" },
      { label: "Unlock Knowledge", href: "/solutions#unlock-knowledge" },
      { label: "Automate Operations", href: "/solutions#automate-operations" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Hospitality", href: "/industries#hospitality" },
      { label: "Healthcare", href: "/industries#healthcare" },
      { label: "Retail & E-commerce", href: "/industries#retail-ecommerce" },
      { label: "Professional Services", href: "/industries#professional-services" },
      { label: "Education", href: "/industries#education" },
      { label: "Real Estate", href: "/industries#real-estate" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/resources" },
      { label: "Insights", href: "/resources" },
      { label: "Case Studies", href: "/resources" },
      { label: "AI Website Scanner", href: "/#scan" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Approach", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Contact Us", href: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink pt-16">
      <div className="container-page">
        <ScanBar />
      </div>

      <div className="container-page mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <span className="text-xl font-extrabold tracking-tight">
            Tech<span className="bg-brand-gradient bg-clip-text text-transparent">Wokx</span>
          </span>
          <div className="mt-0.5 text-[10px] font-medium tracking-[0.14em] text-mist">
            AI FOR YOUR WEBSITE
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
            We turn ordinary business websites into intelligent business
            systems that understand, engage and deliver results.
          </p>
          <div className="mt-5 flex gap-3">
            {[Linkedin, Twitter, Youtube, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-violet/50 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <div className="mt-3 h-px w-6 bg-brand-gradient" />
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="focus-ring group flex items-center gap-1 text-sm text-mist transition hover:text-white"
                  >
                    {link.label}
                    <ChevronRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page mt-14 grid grid-cols-1 gap-6 border-t border-white/5 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-start gap-3">
          <MessageSquare size={18} className="mt-0.5 shrink-0 text-violet" />
          <div>
            <div className="text-sm font-semibold">Have questions?</div>
            <div className="text-sm text-mist">We&apos;re here to help you succeed.</div>
            <Link href="/about" className="focus-ring text-sm font-medium text-violet">
              Contact Us →
            </Link>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail size={18} className="mt-0.5 shrink-0 text-violet" />
          <div>
            <div className="text-sm font-semibold">Email</div>
            <a href="mailto:hello@techwokx.com" className="focus-ring text-sm text-mist hover:text-white">
              hello@techwokx.com
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone size={18} className="mt-0.5 shrink-0 text-violet" />
          <div>
            <div className="text-sm font-semibold">Phone</div>
            <div className="text-sm text-mist">+233 20 123 4567</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={18} className="mt-0.5 shrink-0 text-violet" />
          <div>
            <div className="text-sm font-semibold">Location</div>
            <div className="text-sm text-mist">Accra, Ghana</div>
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-4 border-t border-white/5 py-6 text-xs text-mist sm:flex-row">
        <div className="flex flex-wrap items-center gap-4">
          <span>© {new Date().getFullYear()} TechWokx. All rights reserved.</span>
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <Link href="#" className="hover:text-white">Terms of Service</Link>
          <Link href="#" className="hover:text-white">Cookies Policy</Link>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-violet" />
          Your data is safe with us — enterprise-grade security.
        </div>
      </div>
    </footer>
  );
}
