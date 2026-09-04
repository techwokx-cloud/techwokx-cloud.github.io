"use client";

import {
  Activity,
  TrendingUp,
  Target,
  Users,
  Plus,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";

const stats = [
  { icon: Activity, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Total Scans", value: "64", trend: "↗ 28% vs last month" },
  { icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "AI Score Avg.", value: "72", suffix: "/100", trend: "↗ 12% vs last month" },
  { icon: Target, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "High Opportunities", value: "28", trend: "↗ 35% vs last month" },
  { icon: Users, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "Scans to Leads", value: "28", suffix: "%", trend: "↗ 8% vs last month" },
];

const trendData = [
  { day: "Aug 1", value: 8 }, { day: "Aug 4", value: 14 }, { day: "Aug 7", value: 11 },
  { day: "Aug 10", value: 22 }, { day: "Aug 13", value: 26 }, { day: "Aug 16", value: 24 },
  { day: "Aug 19", value: 34 }, { day: "Aug 22", value: 38 }, { day: "Aug 25", value: 46 },
  { day: "Aug 28", value: 55 }, { day: "Aug 31", value: 64 },
];

const scoreDist = [
  { name: "Excellent (80-100)", value: 18, color: "#10b981" },
  { name: "Good (60-79)", value: 22, color: "#3b82f6" },
  { name: "Average (40-59)", value: 15, color: "#f59e0b" },
  { name: "Poor (0-39)", value: 9, color: "#ef4444" },
];

const recentScans = [
  { site: "abc-hotel.com", biz: "ABC Hotel", type: "Hospitality", score: 86, grade: "Excellent", opps: 12 },
  { site: "xyzrestaurant.com", biz: "XYZ Restaurant", type: "Restaurant", score: 72, grade: "Good", opps: 9 },
  { site: "eliteclinic.com", biz: "Elite Clinic", type: "Healthcare", score: 65, grade: "Good", opps: 7 },
  { site: "citymart.com", biz: "City Mart", type: "Retail", score: 48, grade: "Average", opps: 6 },
  { site: "lawpartners.com", biz: "Law Partners", type: "Professional", score: 35, grade: "Poor", opps: 8 },
];

const opportunities = [
  { label: "Improve Mobile Experience", value: 36 },
  { label: "SEO Optimization", value: 32 },
  { label: "Page Speed Optimization", value: 28 },
  { label: "AI Chat & Automation", value: 24 },
  { label: "Lead Capture Enhancement", value: 20 },
];

const gradeColor = (g: string) =>
  g === "Excellent" ? "bg-emerald-50 text-emerald-600" :
  g === "Good" ? "bg-blue-50 text-blue-600" :
  g === "Average" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600";

export default function ScansPage() {
  const total = scoreDist.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <DashboardTopbar title="Scans" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">
            AI-powered website scans that reveal opportunities and drive results.
          </p>
          <div className="flex gap-2">
            <button className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-navy hover:bg-slate-50">
              <Plus size={13} /> New Scan
            </button>
            <button className="btn-gradient focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs">
              <Sparkles size={13} /> Scan a Website
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Scan Trend</h3>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scanTrendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2} fill="url(#scanTrendFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">AI Score Distribution</h3>
            <div className="relative mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={scoreDist} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={2}>
                    {scoreDist.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-navy">{total}</span>
                <span className="text-[11px] text-slate-400">Total</span>
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              {scoreDist.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-medium text-navy">
                    {d.value} ({Math.round((d.value / total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy">Recent Scans</h3>
              <button className="focus-ring flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
                View All Scans <ChevronRight size={14} />
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="pb-2 font-medium">Website</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">AI Score</th>
                    <th className="pb-2 font-medium">Opportunities</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((s) => (
                    <tr key={s.site} className="border-b border-slate-50">
                      <td className="py-3">
                        <p className="font-medium text-navy">{s.site}</p>
                        <p className="text-xs text-slate-400">{s.biz}</p>
                      </td>
                      <td className="text-slate-500">{s.type}</td>
                      <td>
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${gradeColor(s.grade)}`}>
                          {s.score} {s.grade}
                        </span>
                      </td>
                      <td className="text-slate-500">{s.opps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Top Opportunities Found</h3>
            <div className="mt-4 space-y-4">
              {opportunities.map((o) => (
                <div key={o.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{o.label}</span>
                    <span className="font-semibold text-navy">{o.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                      style={{ width: `${(o.value / 36) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
