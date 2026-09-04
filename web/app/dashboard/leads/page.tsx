"use client";

import {
  Users,
  BadgeCheck,
  Flame,
  Target,
  Trophy,
  Plus,
  Download,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";

const stats = [
  { icon: Users, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "New Leads", value: "28", trend: "↗ 33% vs last month" },
  { icon: BadgeCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Qualified Leads", value: "9", trend: "↗ 29% vs last month" },
  { icon: Flame, iconBg: "bg-rose-50", iconColor: "text-rose-600", label: "Hot Leads", value: "5", trend: "↗ 25% vs last month" },
  { icon: Target, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Conversion Rate", value: "32", suffix: "%", trend: "↗ 8% vs last month" },
];

const pipeline = [
  { label: "New", value: 28, icon: Users },
  { label: "Contacted", value: 18, icon: Users },
  { label: "Qualified", value: 9, icon: BadgeCheck },
  { label: "Proposal Sent", value: 4, icon: Target },
  { label: "Won", value: 4, icon: Trophy },
];

const sourceData = [
  { name: "Facebook Ads", value: 12, color: "#3b82f6" },
  { name: "Instagram Ads", value: 7, color: "#ec4899" },
  { name: "Website Scan", value: 5, color: "#10b981" },
  { name: "Organic Search", value: 3, color: "#f59e0b" },
  { name: "Referral", value: 1, color: "#ef4444" },
];

const leads = [
  { name: "Akosua Boateng", business: "Blue Ocean Restaurant", source: "Facebook Ad", score: 42, type: "Restaurant", status: "New" },
  { name: "Emmanuel Kay", business: "Kay Logistics", source: "Website Scan", score: 78, type: "Logistics", status: "Contacted" },
  { name: "Adwoa Frimpong", business: "Adwoa Boutique", source: "Instagram Ad", score: 55, type: "Retail", status: "Qualified" },
  { name: "Kofi Osei", business: "Osei Farms", source: "Facebook Ad", score: 36, type: "Agriculture", status: "New" },
  { name: "Mabel Asante", business: "Elite Spa", source: "Referral", score: 67, type: "Wellness", status: "Contacted" },
];

const scoreColor = (s: number) =>
  s >= 70 ? "text-emerald-600 bg-emerald-50" : s >= 40 ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";

const statusColor = (s: string) =>
  s === "New" ? "bg-blue-50 text-blue-600" : s === "Contacted" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600";

export default function LeadsPage() {
  const total = sourceData.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <DashboardTopbar title="Leads" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">Manage, qualify and convert leads into clients.</p>
          <div className="flex gap-2">
            <button className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-navy hover:bg-slate-50">
              <Download size={13} /> Import Leads
            </button>
            <button className="btn-gradient focus-ring flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs">
              <Plus size={13} /> Add Lead
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
            <h3 className="text-base font-bold text-navy">Lead Pipeline</h3>
            <div className="mt-6 grid grid-cols-5 gap-2">
              {pipeline.map((p) => (
                <div key={p.label} className="text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-violet-50">
                    <p.icon size={18} className="text-violet-600" />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{p.label}</p>
                  <p className="text-lg font-extrabold text-navy">{p.value}</p>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Leads by Source</h3>
            <div className="relative mt-3 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {sourceData.map((d) => (
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
              {sourceData.map((d) => (
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

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-navy">Recent Leads</h3>
            <button className="focus-ring flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
              View All Leads <ChevronRight size={14} />
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                  <th className="pb-2 font-medium">Lead</th>
                  <th className="pb-2 font-medium">Source</th>
                  <th className="pb-2 font-medium">AI Score</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.name} className="border-b border-slate-50">
                    <td className="py-3">
                      <p className="font-medium text-navy">{l.name}</p>
                      <p className="text-xs text-slate-400">{l.business}</p>
                    </td>
                    <td className="text-slate-500">{l.source}</td>
                    <td>
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${scoreColor(l.score)}`}>
                        {l.score}/100
                      </span>
                    </td>
                    <td className="text-slate-500">{l.type}</td>
                    <td>
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${statusColor(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
            <Sparkles size={18} className="text-violet-600" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">AI Insight: 5 leads are highly likely to convert</p>
            <p className="text-xs text-slate-500">Focus on following up with these hot leads to close more deals.</p>
          </div>
          <button className="focus-ring shrink-0 rounded-lg border border-violet-300 bg-white px-3 py-2 text-xs font-medium text-violet-600 hover:bg-violet-100">
            View Hot Leads
          </button>
        </div>
      </div>
    </>
  );
}
