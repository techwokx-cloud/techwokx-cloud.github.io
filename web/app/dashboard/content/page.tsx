"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, AlertTriangle, Send, Trash2, Wand2 } from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import {
  getContentDrafts,
  generateContentDraft,
  queueContentDraft,
  discardContentDraft,
  type ContentDraft,
} from "@/lib/dashboard-api";

// Matches the real connected Buffer channels from earlier in this project.
const CHANNELS = [
  { id: "6a4ab55f404834462872c3f2", label: "Facebook — Techwokx Ghana" },
  { id: "6a4aa3b04048344628727d89", label: "X — techwokxgh" },
  { id: "6a4a711f4048344628719039", label: "Instagram — techwokxgh" },
];

const statusColor = (s: string) =>
  s === "queued" ? "bg-emerald-50 text-emerald-600" : s === "discarded" ? "bg-slate-100 text-slate-400" : "bg-amber-50 text-amber-600";

export default function ContentPage() {
  const [drafts, setDrafts] = useState<ContentDraft[] | null>(null);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [genError, setGenError] = useState("");
  const [channelChoice, setChannelChoice] = useState<Record<number, string>>({});

  const load = () => {
    getContentDrafts().then(setDrafts).catch((err) => setError(err.message));
  };
  useEffect(load, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setGenError("");
    try {
      await generateContentDraft(topic.trim());
      setTopic("");
      load();
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Failed to generate — check AI provider keys are configured.");
    } finally {
      setGenerating(false);
    }
  };

  const handleQueue = async (id: number) => {
    const channel = channelChoice[id] || CHANNELS[0].id;
    try {
      await queueContentDraft(id, channel);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to queue.");
    }
  };

  const handleDiscard = async (id: number) => {
    try {
      await discardContentDraft(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to discard.");
    }
  };

  if (error) {
    return (
      <>
        <DashboardTopbar title="Social & Content" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar title="Social & Content" />
      <div className="flex-1 space-y-6 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Generate post drafts with AI, review them, then approve to queue via Buffer — nothing posts automatically without your sign-off.
        </p>

        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-violet-600" />
            <h3 className="text-sm font-bold text-navy">Generate a new draft</h3>
          </div>
          <form onSubmit={handleGenerate} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic — e.g. 'why hotels need an AI concierge'"
              className="focus-ring w-full rounded-lg border border-violet-200 bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={generating}
              className="btn-gradient focus-ring flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm disabled:opacity-60"
            >
              {generating ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
              {generating ? "Generating..." : "Generate"}
            </button>
          </form>
          {genError && <p className="mt-2 text-xs text-rose-600">{genError}</p>}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-navy">Drafts</h3>
          {!drafts ? (
            <div className="mt-6 flex justify-center">
              <Loader2 size={20} className="animate-spin text-violet-400" />
            </div>
          ) : drafts.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No drafts yet — generate one above.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {drafts.map((d) => (
                <div key={d.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {d.topic && <p className="text-xs font-medium text-violet-600">{d.topic}</p>}
                      <p className="mt-1 whitespace-pre-wrap text-sm text-navy">{d.content}</p>
                    </div>
                    <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${statusColor(d.status)}`}>
                      {d.status}
                    </span>
                  </div>
                  {d.status === "draft" && (
                    <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center">
                      <select
                        value={channelChoice[d.id] || CHANNELS[0].id}
                        onChange={(e) => setChannelChoice((c) => ({ ...c, [d.id]: e.target.value }))}
                        className="focus-ring rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-navy"
                      >
                        {CHANNELS.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQueue(d.id)}
                          className="focus-ring flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                        >
                          <Send size={12} /> Approve & Queue
                        </button>
                        <button
                          onClick={() => handleDiscard(d.id)}
                          className="focus-ring flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200"
                        >
                          <Trash2 size={12} /> Discard
                        </button>
                      </div>
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
