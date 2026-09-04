import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  suffix,
  trend,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  suffix?: string;
  trend?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon size={19} className={iconColor} />
      </div>
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="mt-0.5 text-2xl font-extrabold text-navy">
        {value}
        {suffix && <span className="text-base font-semibold text-slate-400"> {suffix}</span>}
      </p>
      {trend && <p className="mt-1 text-xs font-medium text-emerald-600">{trend}</p>}
    </div>
  );
}
