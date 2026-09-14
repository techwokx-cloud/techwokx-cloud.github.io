"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, AlertTriangle, Send, Trash2, Wand2, CalendarClock, Facebook, Instagram, Twitter } from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import {
  getContentDrafts,
  generateContentDraft,
  generateContentBatch,
  queueContentDraft,
  discardContentDraft,
  type ContentDraft,
} from "@/lib/dashboard-api";

const CHANNEL_LABEL: Record<string, string> = {
  facebook: "Facebook",
  twitter: "X (Twitter)",
  instagram: "Instagram",
};

const CHANNEL_ICON: Record<string, typeof Facebook> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
};

const statusColor = (s: string) =>
  s === "queued" ? "bg-emerald-50 text-emerald-600" : s === "discarded" ? "bg-slate-100 text-slate-400" : "bg-amber-50 text-amber-600";

export default function ContentPage() {
  const [drafts, setDrafts] = useState<ContentDraft[] | null>(null);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingBatch, setGeneratingBatch] = useState(false);
  const [error, setError] = useState("");
  const [genError, setGenError] = useState("");
  const [queuedInfo, setQueuedInfo] = useState<Record<number, string>>({});

  const load = () => {
    getContentDrafts().then(setDrafts).catch((err) => setError(err.message));
  };
  useEffect(load, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenError("");
    try {
      // Empty topic is fine now — the AI picks a fresh one automatically.
      await generateContentDraft(topic.trim() || undefined);
      setTopic("");
      load();
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Failed to generate — check AI provider keys are configured.");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateBatch = async () => {
    setGeneratingBatch(true);
    setGenError("");
    try {
      await generateContentBatch(topic.trim() || undefined);
      setTopic("");
      load();
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Failed to generate today's batch.");
    } finally {
      setGeneratingBatch(false);
    }
  };

  const handleQueue = async (id: number) => {
    try {
      const result = await queueContentDraft(id);
      setQueuedInfo((q) => ({ ...q, [id]: result.scheduledFor }));
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
          A full batch (Facebook, X, Instagram) generates automatically every day and gets sent to you on WhatsApp for
          review — nothing posts without your approval. You can also generate on demand below.
        </p>

        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-violet-600" />
            <h3 className="text-sm font-bold text-navy">Generate</h3>
          </div>
          <form onSubmit={handleGenerate} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (optional — leave blank to let the AI pick one)"
              className="focus-ring w-full rounded-lg border border-violet-200 bg-white px-3.5 py-2.5 text-sm text-navy placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={generating || generatingBatch}
              className="btn-gradient focus-ring flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm disabled:opacity-60"
            >
              {generating ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
              {generating ? "Generating..." : "Generate (Facebook)"}
            </button>
            <button
              type="button"
              onClick={handleGenerateBatch}
              disabled={generating || generatingBatch}
              className="focus-ring flex shrink-0 items-center justify-center gap-2 rounded-lg border border-violet-300 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 disabled:opacity-60"
            >
              {generatingBatch ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {generatingBatch ? "Generating..." : "Generate All 3 Channels"}
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
              {drafts.map((d) => {
                const Icon = d.channel_service ? CHANNEL_ICON[d.channel_service] : null;
                return (
                  <div key={d.id} className="rounded-xl border border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          {Icon && <Icon size={13} className="text-violet-500" />}
                          <span className="text-xs font-semibold text-violet-600">
                            {d.channel_service ? CHANNEL_LABEL[d.channel_service] : "Facebook"}
                          </span>
                          {d.channel_service === "twitter" && (
                            <span className="text-[10px] text-slate-400">({d.content.length}/280 chars)</span>
                          )}
                        </div>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-navy">{d.content}</p>
                        {d.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={d.image_url}
                            alt=""
                            className="mt-2 h-40 w-40 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                      </div>
                      <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold ${statusColor(d.status)}`}>
                        {d.status}
                      </span>
                    </div>
                    {d.status === "draft" && (
                      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                        <button
                          onClick={() => handleQueue(d.id)}
                          className="focus-ring flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100"
                        >
                          <Send size={12} /> Approve & Queue (best time)
                        </button>
                        <button
                          onClick={() => handleDiscard(d.id)}
                          className="focus-ring flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200"
                        >
                          <Trash2 size={12} /> Discard
                        </button>
                      </div>
                    )}
                    {d.status === "queued" && queuedInfo[d.id] && (
                      <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-400">
                        <CalendarClock size={12} /> Scheduled for {new Date(queuedInfo[d.id]).toLocaleString()}
                      </p>
                    )}
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
