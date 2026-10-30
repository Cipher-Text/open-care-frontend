import { apiGet, buildUrl } from "@/lib/api-client";

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

export type EventKind = "DOCTOR" | "HOSPITAL";
export type EventType = "VIEW" | "CALL" | "DIRECTIONS";

export interface EventKindTotal {
	kind: EventKind;
	eventType: EventType;
	total: number;
}

export interface EventRecordTotal {
	recordId: number;
	slug: string | null;
	name: string | null;
	total: number;
}

export interface EventDay {
	day: string;
	total: number;
}

export interface SearchMetric {
	entity: "doctor" | "hospital";
	filtered: boolean;
	searches: number;
	meanMillis: number | null;
	maxMillis: number | null;
	zeroResults: number;
}

/** Anonymous page counts and search timings. Staff only (view-super-admin-panel). */
export const fetchEventSummary = async (days: number) =>
	unwrap<EventKindTotal[]>(await apiGet(buildUrl("/superadmin/dashboard/public-events/summary", { days })), "Could not load the totals");

export const fetchTopRecords = async (kind: EventKind, type: EventType, days: number, limit = 10) =>
	unwrap<EventRecordTotal[]>(
		await apiGet(buildUrl("/superadmin/dashboard/public-events", { kind, type, days, limit })),
		"Could not load the most viewed records"
	);

export const fetchRecordDaily = async (kind: EventKind, slug: string, type: EventType, days: number) =>
	unwrap<EventDay[]>(await apiGet(buildUrl("/superadmin/dashboard/public-events/daily", { kind, slug, type, days })), "Could not load the daily counts");

export const fetchSearchMetrics = async () => unwrap<SearchMetric[]>(await apiGet("/superadmin/dashboard/search-metrics"), "Could not load the search figures");
