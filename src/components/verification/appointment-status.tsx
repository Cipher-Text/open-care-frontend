import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/api/appointments";

const LABELS: Record<AppointmentStatus, string> = {
	REQUESTED: "Waiting for the doctor",
	CONFIRMED: "Confirmed",
	DECLINED: "Not accepted",
	EXPIRED: "Not answered in time",
	CANCELLED: "Cancelled",
	COMPLETED: "Completed",
	NO_SHOW: "Did not attend",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
	const variant = status === "CONFIRMED" || status === "COMPLETED" ? "default" : status === "REQUESTED" ? "secondary" : "outline";
	return <Badge variant={variant}>{LABELS[status] ?? status}</Badge>;
}

export const hm = (time: string) => time.slice(0, 5);

/** "Sat 31 Oct" from an ISO date, without a time zone shift. */
export const dayLabel = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
