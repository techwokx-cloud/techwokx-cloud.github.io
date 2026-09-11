import { CalendarDays } from "lucide-react";
import ComingSoon from "@/components/dashboard/ComingSoon";
export default function Page() {
  return (
    <ComingSoon
      title="Appointments"
      icon={CalendarDays}
      description="Needs an actual AI booking agent built first — nothing generates bookings yet, so there's no real data to show here. Coming after that feature exists, not just a wiring task."
    />
  );
}
