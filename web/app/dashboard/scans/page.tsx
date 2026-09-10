"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, TrendingUp, Target, Users, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
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
import { getScans, type Scan } from "@/lib/dashboard-api";

const gradeColor = (score: number) =>
  score >= 80 ? "bg-emerald-50 text-emerald-600" :
  score >= 60 ? "bg-blue-50 text-blue-600" :
  score >= 40 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600";

const gradeLabel = (score: number) =>
  score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Poor";

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getScans()
      .then(setScans)
      .catch((err) => setError(err.message));
  }, []);

  const derived = useMemo(() => {
    if (!scans) return null;

    const avgScore = scans.length
      ? Math.round(scans.reduce((s, x) => s + x.readiness_score, 0) / scans.length)
      : 0;
    const highOppScans = scans.filter((s) => s.opportunities.some((o) => o.level === "HIGH")).length;
    const withLead = scans.filter((s) => s.lead_id !== null).length;
    const scanToLeadRate = scans.length ? Math.round((withLead / scans.length) * 100) : 0;

    const byDay = new Map<string, number>();
    scans.forEach((s) => {
      const day = s.scanned_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) || 0) + 1);
    });
    const trendData = Array.from(byDay.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([day, value]) => ({ day: day.slice(5), value }));

    const buckets = [
      { name: "Excellent (80-100)", value: 0, color: "#10b981" },
      { name: "Good (60-79)", value: 0, color: "#3b82f6" },
      { name: "Average (40-59)", value: 0, color: "#f59e0b" },
      { name: "Poor (0-39)", value: 0, color: "#ef4444" },
    ];
    scans.forEach((s) => {
      if (s.readiness_score >= 80) buckets[0].value++;
      else if (s.readiness_score >= 60) buckets[1].value++;
      else if (s.readiness_score >= 40) buckets[2].value++;
      else buckets[3].value++;
    });

    const oppCounts: Record<string, number> = {};
    scans.forEach((s) =>
      s.opportunities.forEach((o) => {
        if (o.level === "HIGH") oppCounts[o.area] = (oppCounts[o.area] || 0) + 1;
      })
    );
    const opportunities = Object.entries(oppCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));

    return { avgScore, highOppScans, scanToLeadRate, trendData, buckets, opportunities };
  }, [scans]);

  if (error) {
    return (
      <>
        <DashboardTopbar title="Scans" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!scans || !derived) {
    return (
      <>
        <DashboardTopbar title="Scans" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const stats = [
    { icon: Activity, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Total Scans", value: String(scans.length), trend: "All time" },
    { icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "AI Score Avg.", value: String(derived.avgScore), suffix: "/100", trend: "Across all scans" },
    { icon: Target, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "High Opportunities", value: String(derived.highOppScans), trend: "Scans with a HIGH finding" },
    { icon: Users, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "Scans to Leads", value: String(derived.scanToLeadRate), suffix: "%", trend: "Converted to a lead" },
  ];

  const total = derived.buckets.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <DashboardTopbar title="Scans" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Every real AI website scan run through your scanner, live from the database.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {scans.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-base font-bold text-navy">Scan Trend</h3>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={derived.trendData}>
                    <defs>
                      <linearGradient id="scanTrendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
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
                    <Pie data={derived.buckets} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={2}>
                      {derived.buckets.map((d) => (
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
                {derived.buckets.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-medium text-navy">
                      {d.value} {total > 0 ? `(${Math.round((d.value / total) * 100)}%)` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Recent Scans</h3>
            {scans.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                No scans yet — run one from the homepage scan widget to see it here.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                      <th className="pb-2 font-medium">Website</th>
                      <th className="pb-2 font-medium">AI Score</th>
                      <th className="pb-2 font-medium">High Opportunities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scans.slice(0, 10).map((s) => (
                      <tr key={s.id} className="border-b border-slate-50">
                        <td className="max-w-[220px] truncate py-3">
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-medium text-navy hover:text-violet-600"
                          >
                            {s.url.replace(/^https?:\/\//, "")}
                            <ExternalLink size={11} className="shrink-0" />
                          </a>
                        </td>
                        <td>
                          <span className={`rounded px-2 py-0.5 text-xs font-semibold ${gradeColor(s.readiness_score)}`}>
                            {s.readiness_score} {gradeLabel(s.readiness_score)}
                          </span>
                        </td>
                        <td className="text-slate-500">
                          {s.opportunities.filter((o) => o.level === "HIGH").length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Top Opportunities Found</h3>
            {derived.opportunities.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">No HIGH-priority findings yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {derived.opportunities.map((o) => (
                  <div key={o.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{o.label}</span>
                      <span className="font-semibold text-navy">{o.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                        style={{ width: `${(o.value / derived.opportunities[0].value) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
