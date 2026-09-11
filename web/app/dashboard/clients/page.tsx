"use client";

import { useEffect, useState } from "react";
import { Briefcase, Loader2, AlertTriangle, Plus, X } from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import { getProjects, createProject, updateProject, getLeads, type Project, type Lead } from "@/lib/dashboard-api";

const STATUSES = ["not_started", "in_progress", "review", "live"] as const;

const statusLabel: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  review: "In Review",
  live: "Live",
};

const statusColor: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-500",
  in_progress: "bg-amber-50 text-amber-600",
  review: "bg-blue-50 text-blue-600",
  live: "bg-emerald-50 text-emerald-600",
};

const PACKAGES = ["AI Assistant", "AI Business", "AI Business Platform"];

export default function ClientsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ businessName: "", packageName: PACKAGES[0], leadId: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getProjects()
      .then(setProjects)
      .catch((err) => setError(err.message));
    getLeads()
      .then(setLeads)
      .catch(() => {});
  };
  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    setSubmitting(true);
    try {
      await createProject({
        businessName: form.businessName,
        packageName: form.packageName,
        leadId: form.leadId ? Number(form.leadId) : undefined,
      });
      setForm({ businessName: "", packageName: PACKAGES[0], leadId: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateProject(id, { status });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update.");
    }
  };

  if (error) {
    return (
      <>
        <DashboardTopbar title="Clients & Projects" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!projects) {
    return (
      <>
        <DashboardTopbar title="Clients & Projects" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const live = projects.filter((p) => p.status === "live").length;
  const inProgress = projects.filter((p) => p.status === "in_progress" || p.status === "review").length;

  return (
    <>
      <DashboardTopbar title="Clients & Projects" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-slate-500">
            Projects are created manually when a lead becomes a paying client — there&apos;s no
            payment integration yet, so this is admin-tracked.
          </p>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="btn-gradient focus-ring flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs"
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? "Cancel" : "New Project"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Business Name</label>
                <input
                  value={form.businessName}
                  onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                  required
                  className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Package</label>
                <select
                  value={form.packageName}
                  onChange={(e) => setForm((f) => ({ ...f, packageName: e.target.value }))}
                  className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {PACKAGES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Link to a Lead (optional)</label>
                <select
                  value={form.leadId}
                  onChange={(e) => setForm((f) => ({ ...f, leadId: e.target.value }))}
                  className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">None</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>{l.business_name} ({l.email})</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient focus-ring mt-4 rounded-lg px-5 py-2 text-sm disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Project"}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Briefcase} iconBg="bg-violet-50" iconColor="text-violet-600" label="Total Projects" value={String(projects.length)} />
          <StatCard icon={Briefcase} iconBg="bg-amber-50" iconColor="text-amber-600" label="In Progress" value={String(inProgress)} />
          <StatCard icon={Briefcase} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Live" value={String(live)} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">All Projects</h3>
          {projects.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No projects yet — create one above once a lead converts.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-navy">{p.business_name}</p>
                    <p className="text-xs text-slate-500">{p.package_name}</p>
                  </div>
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    className={`focus-ring w-fit rounded-lg border-0 px-3 py-1.5 text-xs font-semibold ${statusColor[p.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabel[s]}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
