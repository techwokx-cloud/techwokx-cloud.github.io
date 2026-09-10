"use client";

import { useEffect, useState } from "react";
import {
  Share2,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import {
  getSocialPosts,
  getLatestReport,
  type SocialPost,
  type MonthlyReport,
} from "@/lib/dashboard-api";

const statusColor = (s: string) =>
  s === "posted" ? "bg-emerald-50 text-emerald-600" : s === "failed" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600";

const statusIcon = (s: string) =>
  s === "posted" ? CheckCircle2 : s === "failed" ? XCircle : Clock;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso + "Z").getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function MarketingPage() {
  const [posts, setPosts] = useState<SocialPost[] | null>(null);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [reportError, setReportError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSocialPosts()
      .then(setPosts)
      .catch((err) => setError(err.message));

    getLatestReport()
      .then(setReport)
      .catch(() => setReportError(true)); // 404 = no report generated yet, not a hard error
  }, []);

  if (error) {
    return (
      <>
        <DashboardTopbar title="Marketing" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!posts) {
    return (
      <>
        <DashboardTopbar title="Marketing" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const published = posts.filter((p) => p.status === "posted").length;
  const pending = posts.filter((p) => p.status === "pending").length;
  const failed = posts.filter((p) => p.status === "failed").length;

  const stats = [
    { icon: Share2, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "Total Posts", value: String(posts.length), trend: "All time" },
    { icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Published", value: String(published), trend: "Via Buffer" },
    { icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "Pending", value: String(pending), trend: "Queued to post" },
    { icon: XCircle, iconBg: "bg-rose-50", iconColor: "text-rose-600", label: "Failed", value: String(failed), trend: failed > 0 ? "Needs a look" : "All clear" },
  ];

  return (
    <>
      <DashboardTopbar title="Marketing" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Social posting (via Buffer) and the AI campaign strategist&apos;s latest recommendation.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {!reportError && report && (
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <Sparkles size={16} className="text-violet-600" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  AI Campaign Strategist
                </p>
                <p className="flex items-center gap-1.5 text-base font-bold text-navy">
                  <TrendingUp size={16} className="text-violet-600" />
                  Recommended focus: {report.recommended_objective}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{report.reasoning}</p>
            <div className="mt-4 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Course of Action
              </p>
              {report.course_of_action.map((action, i) => (
                <p key={i} className="flex items-start gap-1.5 text-sm text-navy">
                  <span className="mt-0.5 text-violet-500">•</span> {action}
                </p>
              ))}
            </div>
          </div>
        )}

        {reportError && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
            No campaign strategist report generated yet — it runs automatically once a month, or can be
            triggered manually via <code className="rounded bg-slate-100 px-1.5 py-0.5">POST /api/reports/generate</code>.
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">Social Posts</h3>
          {posts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              No posts yet — queue one via the admin API to see it here.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {posts.map((p) => {
                const Icon = statusIcon(p.status);
                return (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm text-navy">{p.content}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {p.profile_id} · {timeAgo(p.created_at)}
                      </p>
                    </div>
                    <span
                      className={`flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${statusColor(p.status)}`}
                    >
                      <Icon size={12} /> {p.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
