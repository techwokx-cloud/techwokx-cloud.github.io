"use client";

import { Menu, Bell, ChevronDown } from "lucide-react";

export default function DashboardTopbar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="focus-ring rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-navy">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="focus-ring relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-600" />
        </button>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
            TW
          </span>
          <span className="hidden text-sm font-medium text-navy sm:block">TechWokx</span>
          <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  );
}
