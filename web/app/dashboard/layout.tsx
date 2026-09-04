import type { Metadata } from "next";
import DashboardAuthShell from "@/components/dashboard/DashboardAuthShell";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAuthShell>{children}</DashboardAuthShell>;
}
