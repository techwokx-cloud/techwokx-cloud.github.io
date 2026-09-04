"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Sparkles, Menu, X } from "lucide-react";

type NavItem = { label: string; href: string; blurb?: string };

const productItems: NavItem[] = [
  { label: "AI Platform", href: "/solutions", blurb: "The engine behind every agent" },
  { label: "AI Assistant", href: "/solutions#automate-support", blurb: "Answers visitor questions 24/7" },
  { label: "AI Sales", href: "/solutions#generate-more-leads", blurb: "Qualifies leads, closes more deals" },
  { label: "AI Support", href: "/solutions#automate-support", blurb: "Resolves issues without a queue" },
  { label: "AI Search", href: "/solutions#unlock-knowledge", blurb: "Natural-language knowledge search" },
  { label: "AI Booking", href: "/solutions#automate-bookings", blurb: "Books appointments automatically" },
];

const solutionsItems: NavItem[] = [
  { label: "Generate More Leads", href: "/solutions#generate-more-leads" },
  { label: "Increase Sales", href: "/solutions#increase-sales" },
  { label: "Automate Support", href: "/solutions#automate-support" },
  { label: "Automate Bookings", href: "/solutions#automate-bookings" },
  { label: "Unlock Knowledge", href: "/solutions#unlock-knowledge" },
  { label: "Automate Operations", href: "/solutions#automate-operations" },
];

const industryItems: NavItem[] = [
  { label: "Hospitality", href: "/industries#hospitality" },
  { label: "Healthcare", href: "/industries#healthcare" },
  { label: "Retail & E-commerce", href: "/industries#retail-ecommerce" },
  { label: "Professional Services", href: "/industries#professional-services" },
  { label: "Education", href: "/industries#education" },
  { label: "Real Estate", href: "/industries#real-estate" },
];

function NavDropdown({
  label,
  items,
  activeMenu,
  setActiveMenu,
}: {
  label: string;
  items: NavItem[];
  activeMenu: string | null;
  setActiveMenu: (v: string | null) => void;
}) {
  const isOpen = activeMenu === label;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setActiveMenu(label)}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <button
        className="focus-ring flex items-center gap-1 rounded-md px-1 py-2 text-sm text-white/80 transition hover:text-white"
        aria-expanded={isOpen}
        onClick={() => setActiveMenu(isOpen ? null : label)}
      >
        {label}
        <ChevronDown
          size={15}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3">
          <div className="card-dark rounded-xl bg-navy-800/95 p-2 shadow-glow backdrop-blur">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="focus-ring block rounded-lg px-3 py-2.5 transition hover:bg-white/5"
                onClick={() => setActiveMenu(null)}
              >
                <div className="text-sm font-medium text-white">{item.label}</div>
                {item.blurb && (
                  <div className="mt-0.5 text-xs text-mist">{item.blurb}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="container-page flex h-[72px] items-center justify-between">
        <Link href="/" className="focus-ring flex items-center gap-2">
          <img
            src="/Techwokx_Logo_full_final.png"
            alt="TechWokx — Intelligent Solutions. Secure Futures."
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <NavDropdown
            label="Product"
            items={productItems}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <NavDropdown
            label="Solutions"
            items={solutionsItems}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <NavDropdown
            label="Industries"
            items={industryItems}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <Link href="/pricing" className="focus-ring text-sm text-white/80 transition hover:text-white">
            Pricing
          </Link>
          <Link href="/resources" className="focus-ring text-sm text-white/80 transition hover:text-white">
            Resources
          </Link>
          <Link href="/about" className="focus-ring text-sm text-white/80 transition hover:text-white">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#scan"
            className="btn-gradient focus-ring hidden items-center gap-2 rounded-lg px-4 py-2.5 text-sm sm:inline-flex"
          >
            <Sparkles size={16} />
            Scan My Website
          </Link>
          <button
            className="focus-ring rounded-md p-2 text-white/80 lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-ink px-6 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col divide-y divide-white/5">
            {[
              { label: "Product", href: "/solutions" },
              { label: "Solutions", href: "/solutions" },
              { label: "Industries", href: "/industries" },
              { label: "Pricing", href: "/pricing" },
              { label: "Resources", href: "/resources" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="focus-ring py-3 text-sm text-white/85"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/#scan"
            className="btn-gradient focus-ring mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm"
            onClick={() => setMobileOpen(false)}
          >
            <Sparkles size={16} />
            Scan My Website
          </Link>
        </div>
      )}
    </header>
  );
}
