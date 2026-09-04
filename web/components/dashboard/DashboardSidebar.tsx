"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Search,
  Users,
  Megaphone,
  Briefcase,
  Sparkles,
  MessageCircle,
  CalendarDays,
  Layers,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSession, logout, type DashboardUser } from "@/lib/dashboard-auth";

const navGroups = [
  {
    label: "Main",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutGrid }],
  },
  {
    label: "Growth",
    items: [
      { label: "Scans", href: "/dashboard/scans", icon: Search },
      { label: "Leads", href: "/dashboard/leads", icon: Users },
      { label: "Marketing", href: "/dashboard/marketing", icon: Megaphone },
    ],
  },
  {
    label: "Client Delivery",
    items: [
      { label: "Clients & Projects", href: "/dashboard/clients", icon: Briefcase },
      { label: "AI & Automation", href: "/dashboard/automation", icon: Sparkles },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Inbox", href: "/dashboard/inbox", icon: MessageCircle },
      { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays },
    ],
  },
  {
    label: "Content",
    items: [{ label: "Social & Content", href: "/dashboard/content", icon: Layers }],
  },
  {
    label: "Insights",
    items: [{ label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 }],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-navy-800">
      <div className="flex items-center gap-2 px-5 py-6">
        <img src="/Techwokx_footer_logo.png" alt="" className="h-8 w-8" />
        <div className="leading-none">
          <p className="text-sm font-extrabold tracking-wide text-white">TECHWOKX</p>
          <p className="mt-0.5 text-[9px] font-medium tracking-[0.1em] text-mist">
            AI BUSINESS CONTROL CENTER
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-mist/70">
              {group.label}
            </p>
            <div className="mt-2 space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-brand-gradient font-medium text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-white/5 p-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-white/5"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
            {(user?.name || "TW").slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">
              {user?.name || "TechWokx Admin"}
            </span>
            <span className="block text-xs text-mist">Admin</span>
          </span>
          <ChevronDown size={14} className="shrink-0 text-mist" />
        </button>
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-lg border border-white/10 bg-navy-700 shadow-glow">
            <button
              onClick={handleLogout}
              className="focus-ring flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 hover:text-white"
            >
              <LogOut size={14} />
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
