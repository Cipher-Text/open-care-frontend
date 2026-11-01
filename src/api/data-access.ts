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

/** One viewer's reads of the signed-in donor's listing on one day. A member is shown by a shortened name, staff only as "Open Care staff". */
export interface DonorView {
	id: number;
	date: string;
	viewerType: "MEMBER" | "STAFF";
	viewerLabel: string | null;
	times: number;
	/** What the listing showed of the donor then: only what the donor chose to share. */
	contactShown: "NAME_ONLY" | "PHONE" | "ADDRESS" | "PHONE_ADDRESS";
	lastViewedAt: string;
}

/** Who looked at the signed-in person's blood donor listing. */
export const fetchMyDonorViews = async (page: number, size: number): Promise<PageResult<DonorView>> =>
	normalizePage(unwrap<WirePage<DonorView>>(await apiGet(buildUrl("/me/donor-views", { page: toWirePage(page), size })), "Could not load who looked at your listing"));
