import { CalendarDays } from "lucide-react";
import ComingSoon from "@/components/dashboard/ComingSoon";
export default function Page() {
  return <ComingSoon title="Appointments" icon={CalendarDays} description="See and manage bookings your AI agents schedule for clients." />;
}
