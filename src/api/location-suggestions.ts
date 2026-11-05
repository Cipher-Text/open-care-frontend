import { apiGet, apiPost, buildUrl, unwrap } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";

export type SuggestionStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUPERSEDED";
export type SuggestionConfidence = "CORROBORATED" | "REGISTRY_ONLY";

export interface LocationSuggestion {
	id: number;
	hospitalId: number;
	hospitalName: string;
	districtName: string | null;
	currentPlace: string | null;
	suggestedPlace: string;
	suggestedType: "UPAZILA" | "THANA";
	address: string | null;
	registryField: string | null;
	confidence: SuggestionConfidence;
	reason: string | null;
	status: SuggestionStatus;
	decidedAt: string | null;
}

export interface BulkResult {
	approved: number;
	superseded: number;
	stillPending: number;
}

export const fetchSuggestions = async (filters: { status: SuggestionStatus; confidence?: SuggestionConfidence | ""; districtId?: string; page: number; size: number }): Promise<PageResult<LocationSuggestion>> =>
	normalizePage(
		unwrap<WirePage<LocationSuggestion>>(
			await apiGet(
				buildUrl("/admin/location-suggestions", {
					status: filters.status,
					confidence: filters.confidence || undefined,
					districtId: filters.districtId || undefined,
					page: toWirePage(filters.page),
					size: filters.size,
				})
			),
			"Could not load the suggestions"
		)
	);

export const decideSuggestion = async (id: number, approve: boolean) =>
	unwrap<LocationSuggestion>(await apiPost(`/admin/location-suggestions/${id}/${approve ? "approve" : "reject"}`), approve ? "Could not approve" : "Could not refuse");

export const approveConfirmedSuggestions = async () => unwrap<BulkResult>(await apiPost("/admin/location-suggestions/approve-confirmed"), "Could not approve");
