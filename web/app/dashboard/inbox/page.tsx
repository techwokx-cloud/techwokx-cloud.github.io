"use client";

import { useState } from "react";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Bot,
  Timer,
  Search,
  Paperclip,
  Smile,
  Send,
  Star,
  Mail,
  MapPin,
  Building2,
  ExternalLink,
} from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import StatCard from "@/components/dashboard/StatCard";

const stats = [
  { icon: MessageCircle, iconBg: "bg-violet-50", iconColor: "text-violet-600", label: "All Conversations", value: "128", trend: "↗ 24% vs last month" },
  { icon: MessageCircle, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Open", value: "42", trend: "↗ 18% vs last month" },
  { icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "Waiting", value: "18", trend: "↗ 12% vs last month" },
  { icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Resolved", value: "68", trend: "↗ 32% vs last month" },
  { icon: Bot, iconBg: "bg-indigo-50", iconColor: "text-indigo-600", label: "AI Handled", value: "46", trend: "36% of total chats" },
  { icon: Timer, iconBg: "bg-slate-100", iconColor: "text-slate-600", label: "Response Time", value: "1m 24s", trend: "↘ 15% vs last month" },
];

const conversations = [
  { name: "Kofi Mensah", channel: "🟢", preview: "Hi, I need help with my restaurant website.", time: "10:24 AM", status: "Open", score: 78 },
  { name: "Ama Serwaa", channel: "🔴", preview: "Do you offer AI booking for salons?", time: "9:48 AM", status: "Open", score: 62 },
  { name: "CityMart Ghana", channel: "🔵", preview: "Can I get a free website scan?", time: "9:15 AM", status: "Open", score: 80 },
  { name: "+233 55 123 4567", channel: "🟢", preview: "Thanks for the scan report!", time: "Yesterday", status: "Waiting", score: 45 },
  { name: "Nana Boateng", channel: "🔵", preview: "How much for AI automation?", time: "Yesterday", status: "Open", score: 70 },
  { name: "Esi Addo", channel: "🔴", preview: "I'm interested in AI retrofit", time: "Aug 28", status: "Open", score: 86 },
  { name: "info@kaylogistics.com", channel: "✉️", preview: "Let's schedule a call.", time: "Aug 27", status: "Waiting", score: 60 },
];

const thread = [
  { from: "user", text: "Hi, I need help with my restaurant website.", time: "10:21 AM" },
  {
    from: "bot",
    text: "Hello Kofi 👋 I'd be happy to help you. I see you requested a free website scan for \"Taste of Ghana Restaurant\". Would you like me to share your results?",
    time: "10:22 AM",
  },
  { from: "user", text: "Yes please! Also, do you offer online ordering and table booking?", time: "10:22 AM" },
  {
    from: "bot",
    text: "Yes! We can build a custom website with online ordering, table booking, and AI chatbot support. Would you like to schedule a quick call?",
    time: "10:23 AM",
  },
  { from: "user", text: "That sounds great. Let's do it.", time: "10:24 AM" },
];

export default function InboxPage() {
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <>
      <DashboardTopbar title="Inbox" />
      <div className="flex-1 space-y-5 overflow-y-auto p-5 lg:p-8">
        <div>
          <p className="text-sm text-slate-500">
            Unified conversations across all channels. Respond faster. Close more deals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr_280px]">
          {/* Conversation list */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-3">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  placeholder="Search conversations..."
                  className="w-full bg-transparent text-sm text-navy placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-[520px] flex-1 overflow-y-auto">
              {conversations.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setActive(i)}
                  className={`flex w-full flex-col gap-1 border-b border-slate-100 px-4 py-3 text-left transition ${
                    active === i ? "bg-violet-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                      <span>{c.channel}</span> {c.name}
                    </span>
                    <span className="text-[11px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-slate-500">{c.preview}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        c.status === "Open"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="text-[10px] text-slate-400">AI Score: {c.score}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Thread */}
          <div className="flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  {conversations[active].name}
                  <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">
                    AI Score: {conversations[active].score}
                  </span>
                </p>
                <p className="text-xs text-slate-500">Started from: Free Website Scan</p>
              </div>
              <button className="focus-ring flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-navy hover:bg-slate-50">
                View Scan Report <ExternalLink size={12} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {thread.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
                  <div className="max-w-[80%]">
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.from === "user"
                          ? "bg-slate-100 text-navy"
                          : "bg-violet-600 text-white"
                      }`}
                    >
                      {m.text}
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 p-3">
              <button className="focus-ring rounded-lg p-2 text-slate-400 hover:bg-slate-50">
                <Smile size={17} />
              </button>
              <button className="focus-ring rounded-lg p-2 text-slate-400 hover:bg-slate-50">
                <Paperclip size={17} />
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none"
              />
              <button className="btn-gradient focus-ring flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm">
                <Send size={14} /> Send
              </button>
            </div>
          </div>

          {/* Contact panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Contact Details
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                  KM
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{conversations[active].name}</p>
                  <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                    Hot Lead
                  </span>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-500">
                <p className="flex items-center gap-1.5">
                  <MessageCircle size={12} /> +233 24 123 4567
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail size={12} /> kofi.mensah@email.com
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin size={12} /> Accra, Ghana
                </p>
                <p className="flex items-center gap-1.5">
                  <Building2 size={12} /> Taste of Ghana Restaurant
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                AI Lead Insights
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-violet-500">
                  <span className="text-lg font-extrabold text-navy">78</span>
                </div>
                <div className="space-y-1 text-xs text-slate-500">
                  <p>Interest: <span className="font-semibold text-navy">High</span></p>
                  <p>Budget: <span className="font-semibold text-navy">Good</span></p>
                  <p>Priority: <span className="font-semibold text-navy">High</span></p>
                </div>
              </div>
            </div>

            <button className="btn-gradient focus-ring flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm">
              <Star size={15} /> Convert to Lead
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
