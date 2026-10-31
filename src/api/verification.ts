import { apiGet, apiPost, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type { RegisterCheckResult, VerificationCase, VerificationStats, VerificationStatus, VerificationSubject } from "@/types/verification";

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

// ---- the person asking

export const startDoctorVerification = async () => unwrap<VerificationCase>(await apiPost("/verification/doctor"), "Could not start the request");

export const startFacilityClaim = async (hospitalId: number | string, note?: string) =>
	unwrap<VerificationCase>(await apiPost(`/verification/facility/${hospitalId}`, note ? { note } : undefined), "Could not start the claim");

export const fetchMyVerifications = async () => unwrap<VerificationCase[]>(await apiGet("/verification/mine"), "Could not load your requests");

export const fetchMyVerification = async (id: number | string) =>
	unwrap<VerificationCase>(await apiGet(`/verification/${id}`), "Could not load the request");

export const submitVerification = async (id: number | string, note?: string) =>
	unwrap<VerificationCase>(await apiPost(`/verification/${id}/submit`, note ? { note } : undefined), "Could not submit the request");

export const withdrawVerification = async (id: number | string) =>
	unwrap<VerificationCase>(await apiPost(`/verification/${id}/withdraw`), "Could not withdraw the request");

// ---- staff

export interface QueueFilters {
	page: number;
	size: number;
	type?: VerificationSubject | "";
	status?: VerificationStatus | "";
}

export const fetchVerificationQueue = async (filters: QueueFilters): Promise<PageResult<VerificationCase>> => {
	const url = buildUrl("/admin/verification", {
		page: toWirePage(filters.page),
		size: filters.size,
		type: filters.type || undefined,
		status: filters.status || undefined,
	});
	return normalizePage(unwrap<WirePage<VerificationCase>>(await apiGet(url), "Could not load the queue"));
};

export const fetchVerificationDetail = async (id: number | string) =>
	unwrap<VerificationCase>(await apiGet(`/admin/verification/${id}`), "Could not load the request");

export const fetchVerificationStats = async () => unwrap<VerificationStats>(await apiGet("/admin/verification/stats"), "Could not load the figures");

export const startVerificationReview = async (id: number | string) =>
	unwrap<VerificationCase>(await apiPost(`/admin/verification/${id}/start-review`), "Could not start the review");

export const approveVerification = async (id: number | string, note?: string) =>
	unwrap<VerificationCase>(await apiPost(`/admin/verification/${id}/approve`, note ? { note } : undefined), "Could not approve");

/** What the reviewer found when they looked the doctor's number up in the BMDC register by hand. A doctor request can be approved only after a MATCH. */
export const recordRegisterCheck = async (id: number | string, result: RegisterCheckResult, note?: string) =>
	unwrap<VerificationCase>(await apiPost(`/admin/verification/${id}/register-check`, { result, note: note || undefined }), "Could not record the check");

export const rejectVerification = async (id: number | string, reason: string) =>
	unwrap<VerificationCase>(await apiPost(`/admin/verification/${id}/reject`, { note: reason }), "Could not reject");

export const revokeVerification = async (id: number | string, reason: string) =>
	unwrap<VerificationCase>(await apiPost(`/admin/verification/${id}/revoke`, { note: reason }), "Could not revoke");

/** A five-minute link to one document. Opening it is recorded in the history of the request. */
export const fetchDocumentLink = async (id: number | string, documentId: number | string) =>
	unwrap<{ url: string }>(await apiGet(`/admin/verification/${id}/documents/${documentId}/link`), "Could not open the document");
