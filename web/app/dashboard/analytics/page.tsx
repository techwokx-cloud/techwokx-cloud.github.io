"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import { getOverview, type Overview } from "@/lib/dashboard-api";
import { siteConfig } from "@/lib/site-config";
import { getToken } from "@/lib/dashboard-auth";

type ReportRow = {
  id: number;
  period_end: string;
  recommended_objective: string;
  metrics: Record<string, number>;
};

async function fetchReports(): Promise<ReportRow[]> {
  const token = getToken();
  const res = await fetch(`${siteConfig.apiBaseUrl}/api/reports`, {
    headers: { "x-admin-token": token || "" },
  });
  if (!res.ok) throw new Error("Failed to load reports");
  return res.json();
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [reports, setReports] = useState<ReportRow[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getOverview(), fetchReports()])
      .then(([ov, r]) => {
        setOverview(ov);
        setReports(r.reverse()); // oldest first for the chart
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <>
        <DashboardTopbar title="Analytics" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!overview || !reports) {
    return (
      <>
        <DashboardTopbar title="Analytics" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const chartData = reports.map((r) => ({
    period: new Date(r.period_end).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    leads: r.metrics.leadCount ?? 0,
    scans: r.metrics.scanCount ?? 0,
    reach: r.metrics.reach ?? 0,
  }));

  return (
    <>
      <DashboardTopbar title="Analytics" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Cross-channel performance, built from real scan/lead data and the AI strategist&apos;s monthly reports.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={BarChart3} iconBg="bg-violet-50" iconColor="text-violet-600" label="Total Scans" value={String(overview.totalScans)} trend={`+${overview.scansThisWeek} this week`} />
          <StatCard icon={TrendingUp} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Total Leads" value={String(overview.totalLeads)} trend={`+${overview.leadsThisWeek} this week`} />
          <StatCard icon={Sparkles} iconBg="bg-blue-50" iconColor="text-blue-600" label="Avg Readiness Score" value={String(overview.avgReadinessScore)} suffix="/100" trend="Across all scans" />
          <StatCard icon={BarChart3} iconBg="bg-amber-50" iconColor="text-amber-600" label="Monthly Reports" value={String(reports.length)} trend="Strategist analyses run" />
        </div>

        {reports.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Leads & Scans Over Time</h3>
            <p className="text-xs text-slate-500">One data point per monthly strategist report</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="leads" stroke="#7c3aed" strokeWidth={2} name="Leads" />
                  <Line type="monotone" dataKey="scans" stroke="#3b82f6" strokeWidth={2} name="Scans" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No monthly reports yet — this chart fills in as the AI strategist runs (automatically monthly, or
            trigger one manually via <code className="rounded bg-slate-100 px-1.5 py-0.5">POST /api/reports/generate</code>).
          </div>
        )}

        {reports.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Strategist Recommendation History</h3>
            <div className="mt-4 space-y-2">
              {[...reports].reverse().map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5 text-sm">
                  <span className="text-slate-500">{new Date(r.period_end).toLocaleDateString()}</span>
                  <span className="font-medium text-navy">Focus: {r.recommended_objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
