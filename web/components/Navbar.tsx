"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="focus-ring flex items-center gap-2">
          <img
            src="/Techwokx_Logo_full_final.png"
            alt="TechWokx — Intelligent Solutions. Secure Futures."
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="focus-ring text-sm text-white/80 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="focus-ring hidden text-sm text-white/70 transition hover:text-white sm:inline-block"
          >
            Log In
          </Link>
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
            {navLinks.map((item) => (
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
            href="/login"
            className="focus-ring py-3 text-sm text-white/85"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
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
