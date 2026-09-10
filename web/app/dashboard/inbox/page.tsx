"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  Users,
  Bot,
  Loader2,
  AlertTriangle,
  Search,
} from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";
import {
  getConversations,
  getConversationThread,
  type ConversationSummary,
  type ConversationThread,
} from "@/lib/dashboard-api";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso + "Z").getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [thread, setThread] = useState<ConversationThread | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getConversations()
      .then((list) => {
        setConversations(list);
        if (list.length > 0) setActiveId(list[0].id);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (activeId === null) return;
    setThreadLoading(true);
    getConversationThread(activeId)
      .then(setThread)
      .catch((err) => setError(err.message))
      .finally(() => setThreadLoading(false));
  }, [activeId]);

  const filtered = useMemo(() => {
    if (!conversations) return [];
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(
      (c) =>
        c.business_name?.toLowerCase().includes(q) ||
        c.lead_email?.toLowerCase().includes(q) ||
        c.last_message?.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  if (error) {
    return (
      <>
        <DashboardTopbar title="Inbox" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={16} /> {error}
          </div>
        </div>
      </>
    );
  }

  if (!conversations) {
    return (
      <>
        <DashboardTopbar title="Inbox" />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-violet-400" />
        </div>
      </>
    );
  }

  const withLead = conversations.filter((c) => c.lead_email).length;
  const totalMessages = conversations.reduce((s, c) => s + c.message_count, 0);
  const avgMessages = conversations.length ? Math.round(totalMessages / conversations.length) : 0;

  const stats = [
    { icon: MessageCircle, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "All Conversations", value: String(conversations.length), trend: "All time" },
    { icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Linked to a Lead", value: String(withLead), trend: `${conversations.length - withLead} anonymous` },
    { icon: Bot, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", label: "Avg Messages / Chat", value: String(avgMessages), trend: `${totalMessages} messages total` },
  ];

  const active = conversations.find((c) => c.id === activeId);

  return (
    <>
      <DashboardTopbar title="Inbox" />
      <div className="flex-1 space-y-5 overflow-y-auto p-5 lg:p-8">
        <p className="text-sm text-slate-500">
          Real conversations from the AI chat widget. Read-only for now — replying from here isn&apos;t built yet.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            No conversations yet — they&apos;ll show up here as soon as someone chats with the AI assistant.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 p-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <Search size={14} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="max-h-[560px] flex-1 overflow-y-auto">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={`flex w-full flex-col gap-1 border-b border-slate-100 px-4 py-3 text-left transition ${
                      activeId === c.id ? "bg-violet-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-semibold text-navy">
                        {c.business_name || "Anonymous visitor"}
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {timeAgo(c.last_message_at)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500">{c.last_message}</p>
                    <span className="text-[10px] text-slate-400">
                      {c.message_count} message{c.message_count !== 1 ? "s" : ""} · {c.site_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-100 p-4">
                <p className="text-sm font-semibold text-navy">
                  {active?.business_name || "Anonymous visitor"}
                </p>
                <p className="text-xs text-slate-500">
                  {active?.lead_email || `Session: ${active?.session_id.slice(0, 16)}...`}
                </p>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {threadLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-violet-400" />
                  </div>
                ) : (
                  thread?.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                      <div className="max-w-[80%]">
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            m.role === "user" ? "bg-slate-100 text-navy" : "bg-violet-600 text-white"
                          }`}
                        >
                          {m.content}
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {m.provider && ` · ${m.provider}`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
