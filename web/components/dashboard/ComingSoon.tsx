import type { LucideIcon } from "lucide-react";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function ComingSoon({
  title,
  icon: Icon,
  description,
}: {
  title: string;
  icon: LucideIcon;
  description: string;
}) {
  return (
    <>
      <DashboardTopbar title={title} />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
            <Icon size={26} className="text-violet-600" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-navy">{title}</h2>
          <p className="mt-1.5 text-sm text-slate-500">{description}</p>
          <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Coming soon — connects to the VPS backend
          </span>
        </div>
      </div>
    </>
  );
}
