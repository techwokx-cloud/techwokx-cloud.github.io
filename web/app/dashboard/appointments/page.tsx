"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Loader2, AlertTriangle, Check, X, Clock, Phone } from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import { getAppointments, updateAppointmentStatus, type Appointment } from "@/lib/dashboard-api";

const statusColor: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-rose-50 text-rose-600",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso + "Z").getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () => {
    getAppointments().then(setAppointments).catch((err) => setError(err.message));
  };
  useEffect(load, []);

  const handleStatus = async (id: number, status: string) => {
    setBusyId(id);
    try {
      await updateAppointmentStatus(id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update.");
    } finally {
      setBusyId(null);
    }
  };

  if (error) {
    return (
      <>
        <DashboardTopbar title="Appointments" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!appointments) {
    return (
      <>
        <DashboardTopbar title="Appointments" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const pending = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;

  return (
    <>
      <DashboardTopbar title="Appointments" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Real bookings collected by the AI chat assistant — it gathers name, contact, and preferred
          time conversationally, then creates a pending request here for you to confirm.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={CalendarDays} iconBg="bg-violet-50" iconColor="text-violet-600" label="Total Requests" value={String(appointments.length)} />
          <StatCard icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" label="Pending" value={String(pending)} trend="Needs your confirmation" />
          <StatCard icon={Check} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Confirmed" value={String(confirmed)} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">Booking Requests</h3>
          {appointments.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              No bookings yet — they&apos;ll appear here automatically when the AI chat assistant collects one.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-navy">{a.client_name}</p>
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${statusColor[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone size={11} /> {a.client_contact}
                      <span className="mx-1">·</span>
                      <Clock size={11} /> {a.requested_time}
                    </p>
                    {a.note && <p className="mt-1 text-xs text-slate-400">{a.note}</p>}
                    <p className="mt-1 text-[11px] text-slate-300">
                      via {a.site_name} · {timeAgo(a.created_at)}
                    </p>
                  </div>
                  {a.status === "pending" && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleStatus(a.id, "confirmed")}
                        disabled={busyId === a.id}
                        className="focus-ring flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <Check size={12} /> Confirm
                      </button>
                      <button
                        onClick={() => handleStatus(a.id, "cancelled")}
                        disabled={busyId === a.id}
                        className="focus-ring flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                      >
                        <X size={12} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
