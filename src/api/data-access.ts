import { apiGet, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";

export type DataAccessKind = "HEALTH_VITALS" | "PRESCRIPTION" | "PROFILE" | "DONOR_LIST" | "PRIVATE_FILE";

export interface DataAccess {
	id: number;
	kind: DataAccessKind;
	action: string;
	detail: string | null;
	actorType: "DOCTOR" | "STAFF" | "MEMBER";
	/** A doctor by name; staff as "Open Care staff" for the person, by account name for staff. */
	actorLabel: string;
	actorProfileId: number | null;
	subjectProfileId: number | null;
	subjectName: string | null;
	date: string;
}

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

/** Other people's accesses to the signed-in person's own data. */
export const fetchMyDataAccess = async (page: number, size: number): Promise<PageResult<DataAccess>> =>
	normalizePage(unwrap<WirePage<DataAccess>>(await apiGet(buildUrl("/me/data-access", { page: toWirePage(page), size })), "Could not load the access log"));

/** Every recorded access; needs view-user-activity. */
export const fetchDataAccess = async (filters: { kind?: DataAccessKind | ""; actor?: string; subject?: string; page: number; size: number }): Promise<PageResult<DataAccess>> =>
	normalizePage(
		unwrap<WirePage<DataAccess>>(
			await apiGet(buildUrl("/admin/data-access", { kind: filters.kind || undefined, actor: filters.actor || undefined, subject: filters.subject || undefined, page: toWirePage(filters.page), size: filters.size })),
			"Could not load the access log"
		)
	);
