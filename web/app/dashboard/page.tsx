"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  TrendingUp,
  Megaphone,
  Mail,
  MessageCircle,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import { getOverview, getLeads, type Overview, type Lead } from "@/lib/dashboard-api";

export default function DashboardHome() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOverview(), getLeads()])
      .then(([ov, leads]) => {
        setOverview(ov);
        setRecentLeads(leads.slice(0, 5));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <DashboardTopbar title="Dashboard" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  if (error || !overview) {
    return (
      <>
        <DashboardTopbar title="Dashboard" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} />
            {error || "Couldn't load dashboard data."}
          </div>
        </div>
      </>
    );
  }

  const stats = [
    { icon: Users, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "Total Leads", value: String(overview.totalLeads), trend: `+${overview.leadsThisWeek} this week` },
    { icon: Search, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "Total Scans", value: String(overview.totalScans), trend: `+${overview.scansThisWeek} this week` },
    { icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Avg Readiness Score", value: String(overview.avgReadinessScore), suffix: "/ 100", trend: "Across all scans" },
    { icon: Megaphone, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Active Enrollments", value: String(overview.activeEnrollments), trend: `${overview.activeCampaigns} active campaign(s)` },
    { icon: Mail, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", label: "Emails Sent", value: String(overview.emailsSent), trend: overview.emailsFailed > 0 ? `${overview.emailsFailed} failed` : "0 failed" },
    { icon: MessageCircle, iconBg: "bg-rose-50", iconColor: "text-rose-600", label: "AI Conversations", value: String(overview.conversations), trend: "All time" },
  ];

  const opportunityEntries = Object.entries(overview.topOpportunityAreas).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <DashboardTopbar title="Dashboard" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <div>
          <h2 className="text-xl font-extrabold text-navy">Welcome back!</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Real-time data from your AI Layer — leads, scans, campaigns, and conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-base font-bold text-navy">Top Opportunity Areas</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              HIGH-priority findings across your last 200 scans
            </p>
            {opportunityEntries.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">No scans yet.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {opportunityEntries.map(([area, count]) => {
                  const max = opportunityEntries[0][1];
                  return (
                    <div key={area}>
                      <div className="flex justify-between text-sm">
                        <span className="text-navy">{area}</span>
                        <span className="font-semibold text-navy">{count}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy">Recent Leads</h3>
              <Link
                href="/dashboard/leads"
                className="focus-ring flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">No leads yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-navy">{lead.business_name}</p>
                      <p className="truncate text-xs text-slate-500">{lead.email}</p>
                    </div>
                    {lead.readiness_score !== null && (
                      <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">
                        {lead.readiness_score}/100
                      </span>
                    )}
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
