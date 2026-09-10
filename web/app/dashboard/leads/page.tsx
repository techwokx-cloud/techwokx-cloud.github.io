"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Megaphone, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import { getLeads, type Lead } from "@/lib/dashboard-api";

const scoreColor = (s: number | null) =>
  s === null ? "text-slate-400 bg-slate-50" : s >= 70 ? "text-emerald-600 bg-emerald-50" : s >= 40 ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";

const campaignColor = (s: string | null) =>
  s === "active" ? "bg-emerald-50 text-emerald-600" : s === "completed" ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-500";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso + "Z").getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeads()
      .then(setLeads)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <>
        <DashboardTopbar title="Leads" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!leads) {
    return (
      <>
        <DashboardTopbar title="Leads" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const withScore = leads.filter((l) => l.readiness_score !== null);
  const avgScore = withScore.length
    ? Math.round(withScore.reduce((sum, l) => sum + (l.readiness_score || 0), 0) / withScore.length)
    : 0;
  const inActiveCampaign = leads.filter((l) => l.campaign_status === "active").length;
  const thisWeek = leads.filter(
    (l) => Date.now() - new Date(l.created_at + "Z").getTime() < 7 * 86400000
  ).length;

  const stats = [
    { icon: Users, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "Total Leads", value: String(leads.length), trend: `+${thisWeek} this week` },
    { icon: TrendingUp, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Avg Readiness Score", value: String(avgScore), suffix: "/ 100", trend: "Across leads with a scan" },
    { icon: Megaphone, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "In Active Campaign", value: String(inActiveCampaign), trend: "Currently enrolled" },
  ];

  return (
    <>
      <DashboardTopbar title="Leads" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Every lead captured from a website scan, with their readiness score and campaign status.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">All Leads</h3>
          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              No leads yet — they&apos;ll show up here as soon as someone completes a scan and submits their details.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                    <th className="pb-2 font-medium">Business</th>
                    <th className="pb-2 font-medium">Scanned Site</th>
                    <th className="pb-2 font-medium">AI Score</th>
                    <th className="pb-2 font-medium">Campaign</th>
                    <th className="pb-2 font-medium">Captured</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-slate-50">
                      <td className="py-3">
                        <p className="font-medium text-navy">{l.business_name}</p>
                        <p className="text-xs text-slate-400">{l.email}</p>
                      </td>
                      <td className="max-w-[180px] truncate text-slate-500">
                        {l.source_url ? (
                          <a
                            href={l.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-violet-600"
                          >
                            {l.source_url.replace(/^https?:\/\//, "")}
                            <ExternalLink size={11} className="shrink-0" />
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${scoreColor(l.readiness_score)}`}>
                          {l.readiness_score !== null ? `${l.readiness_score}/100` : "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${campaignColor(l.campaign_status)}`}>
                          {l.campaign_status ? l.campaign_status : "Not enrolled"}
                        </span>
                      </td>
                      <td className="text-slate-500">{timeAgo(l.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
