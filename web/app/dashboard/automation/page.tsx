"use client";

import { useEffect, useState } from "react";
import { Megaphone, Bot, Loader2, AlertTriangle, Play, Pause, Power } from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import {
  getCampaigns,
  getSites,
  setCampaignStatus,
  setSiteActive,
  type Campaign,
  type Site,
} from "@/lib/dashboard-api";

export default function AutomationPage() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [sites, setSites] = useState<Site[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    Promise.all([getCampaigns(), getSites()])
      .then(([c, s]) => {
        setCampaigns(c);
        setSites(s);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const toggleCampaign = async (c: Campaign) => {
    setBusyId(`c${c.id}`);
    try {
      await setCampaignStatus(c.id, c.status === "active" ? "paused" : "active");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update campaign.");
    } finally {
      setBusyId(null);
    }
  };

  const toggleSite = async (s: Site) => {
    setBusyId(`s${s.id}`);
    try {
      await setSiteActive(s.id, !s.is_active);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update site.");
    } finally {
      setBusyId(null);
    }
  };

  if (error) {
    return (
      <>
        <DashboardTopbar title="AI & Automation" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!campaigns || !sites) {
    return (
      <>
        <DashboardTopbar title="AI & Automation" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const activeSites = sites.filter((s) => s.is_active).length;
  const totalEnrollments = campaigns.reduce((sum, c) => sum + c.active_enrollment_count, 0);

  return (
    <>
      <DashboardTopbar title="AI & Automation" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Control the email campaigns and AI chat sites actually running in production.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Megaphone} iconBg="bg-violet-50" iconColor="text-violet-600" label="Active Campaigns" value={String(activeCampaigns)} trend={`of ${campaigns.length} total`} />
          <StatCard icon={Bot} iconBg="bg-blue-50" iconColor="text-blue-600" label="Active AI Sites" value={String(activeSites)} trend={`of ${sites.length} total`} />
          <StatCard icon={Play} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Leads in Active Sequences" value={String(totalEnrollments)} trend="Currently enrolled" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">Email Campaigns</h3>
          {campaigns.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No campaigns yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {campaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-navy">{c.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {c.step_count} steps · {c.active_enrollment_count} active / {c.enrollment_count} total enrollments · {c.duration_days}-day sequence
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCampaign(c)}
                    disabled={busyId === `c${c.id}`}
                    className={`focus-ring flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                      c.status === "active"
                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    {c.status === "active" ? <Pause size={13} /> : <Play size={13} />}
                    {c.status === "active" ? "Pause" : "Activate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">AI Chat Sites</h3>
          {sites.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No AI chat sites configured yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {sites.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-navy">{s.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Key: {s.site_key} {s.domain && `· ${s.domain}`}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSite(s)}
                    disabled={busyId === `s${s.id}`}
                    className={`focus-ring flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                      s.is_active
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <Power size={13} />
                    {s.is_active ? "Active" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
