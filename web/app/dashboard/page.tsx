"use client";

import {
  Monitor,
  Bot,
  Users,
  Search,
  UsersRound,
  Megaphone,
  ChevronRight,
} from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";

const stats = [
  { icon: Monitor, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "Website Projects", value: "3", suffix: "/ 4", trend: "This Month" },
  { icon: Bot, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "AI Retrofits", value: "4", suffix: "/ 5", trend: "This Month" },
  { icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "New Leads", value: "28", trend: "This Month" },
  { icon: Search, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "Scans", value: "64", trend: "This Month" },
  { icon: UsersRound, iconBg: "bg-rose-50", iconColor: "text-rose-600", label: "Active Clients", value: "17", trend: "Total" },
  { icon: Megaphone, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", label: "Ad Campaign", value: "Day 6", suffix: "/ 10", trend: "10-Day Campaign" },
];

const pipeline = [
  { label: "New Leads", value: 28, icon: Users, color: "bg-violet-400" },
  { label: "Website Scans", value: 21, icon: Search, color: "bg-blue-400" },
  { label: "Qualified", value: 9, icon: Users, color: "bg-emerald-400" },
  { label: "Projects", value: 4, icon: Monitor, color: "bg-amber-400" },
  { label: "Live", value: 2, icon: Megaphone, color: "bg-pink-400" },
];

const growthGoal = [
  { icon: Monitor, label: "Custom Websites", value: 3, total: 4, color: "bg-violet-500" },
  { icon: Bot, label: "AI Retrofits", value: 4, total: 5, color: "bg-emerald-500" },
  { icon: Megaphone, label: "Paid Ads", value: 6, total: 10, color: "bg-blue-500", unit: "Days" },
  { icon: Users, label: "New Leads", value: 28, total: 40, color: "bg-amber-500" },
  { icon: Search, label: "Scans", value: 64, total: 100, color: "bg-violet-500" },
];

export default function DashboardHome() {
  return (
    <>
      <DashboardTopbar title="Dashboard" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <div>
          <h2 className="text-xl font-extrabold text-navy">Welcome back, TechWokx!</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">Current Pipeline</h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-5">
            {pipeline.map((p, i) => (
              <div key={p.label} className="flex flex-col items-center gap-2 text-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${p.color}/20`}>
                  <p.icon size={17} className="text-navy/70" />
                </div>
                <p className="text-xs text-slate-500">{p.label}</p>
                <p className="text-xl font-extrabold text-navy">{p.value}</p>
                <div
                  className={`h-3 w-full max-w-[120px] ${p.color}`}
                  style={{
                    clipPath: "polygon(10% 0%, 90% 0%, 75% 100%, 25% 100%)",
                    opacity: 1 - i * 0.12,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">August Growth Goal</h3>
            <button className="focus-ring flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
              View Full Report <ChevronRight size={14} />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-5">
            {growthGoal.map((g) => (
              <div key={g.label}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                  <g.icon size={16} className="text-navy/60" />
                </div>
                <p className="mt-2 text-xs text-slate-500">{g.label}</p>
                <p className="text-sm font-bold text-navy">
                  {g.value} / {g.total}
                  {g.unit ? ` ${g.unit}` : ""}
                </p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${g.color}`}
                    style={{ width: `${Math.min(100, (g.value / g.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
