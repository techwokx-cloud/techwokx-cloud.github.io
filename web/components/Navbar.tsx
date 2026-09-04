"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, Menu, X, LayoutDashboard } from "lucide-react";

const navLinks = [
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(139,92,246,0.15)]">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="focus-ring flex items-center gap-2">
          <img
            src="/Techwokx_Logo_full_final.png"
            alt="TechWokx — Intelligent Solutions. Secure Futures."
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open dashboard"
            title="Dashboard"
            className="focus-ring hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-violet/40 hover:bg-white/5 hover:text-white sm:inline-flex"
          >
            <LayoutDashboard size={18} />
          </Link>
          <Link
            href="/#scan"
            className="btn-gradient focus-ring hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm sm:inline-flex"
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
        <div className="border-t border-white/10 bg-ink px-6 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col divide-y divide-white/5">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`focus-ring flex items-center py-3 text-sm ${
                    active ? "font-semibold text-violet" : "text-white/85"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-3 flex items-center gap-2 py-3 text-sm text-white/85"
            onClick={() => setMobileOpen(false)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link
            href="/#scan"
            className="btn-gradient focus-ring mt-4 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm"
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
