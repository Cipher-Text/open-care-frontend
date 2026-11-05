import { apiDelete, apiGet, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";

export type DuplicateKind = "HOSPITAL" | "DOCTOR" | "NURSE" | "AMBULANCE";
export type DuplicateReason = "SAME_KEY" | "SAME_NAME_SAME_PLACE" | "SAME_NAME" | "SAME_DIGITS" | "SIMILAR_NAME";

export interface DuplicateCandidate {
	id: number;
	type: DuplicateKind;
	name: string | null;
	bnName: string | null;
	place: string | null;
	key: string | null;
	active: boolean | null;
	verified: boolean | null;
	slug: string | null;
	reason: DuplicateReason;
	score: number;
}

export interface DuplicateGroup {
	type: DuplicateKind;
	label: string;
	reason: "SAME_NAME" | "SAME_KEY";
	size: number;
	members: DuplicateCandidate[];
}

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

/** Records that look like the one described (name of 3 letters or more and/or a registration number). */
export const checkDuplicates = async (q: { type: DuplicateKind; name?: string; districtId?: string | number; number?: string; excludeId?: number }): Promise<DuplicateCandidate[]> =>
	unwrap<DuplicateCandidate[]>(
		await apiGet(buildUrl("/admin/duplicates/check", { type: q.type, name: q.name || undefined, districtId: q.districtId || undefined, number: q.number || undefined, excludeId: q.excludeId })),
		"Could not look for duplicates"
	);

/** Records that share a name (or, with by NUMBER, a registration number), biggest groups first. */
export const fetchDuplicateGroups = async (q: { type: DuplicateKind; by: "NAME" | "NUMBER"; districtId?: string; page: number; size: number }): Promise<PageResult<DuplicateGroup>> =>
	normalizePage(
		unwrap<WirePage<DuplicateGroup>>(
			await apiGet(buildUrl("/admin/duplicates/groups", { type: q.type, by: q.by, districtId: q.districtId || undefined, page: toWirePage(q.page), size: q.size })),
			"Could not load the groups"
		)
	);

export interface DeletedDuplicate {
	/** The record that remains. */
	id: number;
	name: string | null;
}

/** Deletes one record of a pair that is the same. The server refuses (and says why) when nothing else matches it or something still uses it. */
export const deleteDuplicate = async (type: DuplicateKind, id: number): Promise<DeletedDuplicate> =>
	unwrap<DeletedDuplicate>(await apiDelete(`/admin/duplicates/${type}/${id}`), "Could not delete the record");
