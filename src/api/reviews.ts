import { apiDelete, apiGet, apiPatch, apiPost, apiPut, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type { ModerationReview, MyReview, PublicReview, ReviewEligibility, ReviewInput, ReviewStatus, ReviewSummary } from "@/types/review";

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

export const fetchDoctorReviews = async (doctorId: number | string, page: number, size: number): Promise<PageResult<PublicReview>> =>
	normalizePage(
		unwrap<WirePage<PublicReview>>(await apiGet(buildUrl(`/doctors/${doctorId}/reviews`, { page: toWirePage(page), size }), { includeAuth: false }), "Could not load the reviews")
	);

export const fetchReviewSummary = async (doctorId: number | string) =>
	unwrap<ReviewSummary>(await apiGet(`/doctors/${doctorId}/reviews/summary`, { includeAuth: false }), "Could not load the summary");

// ---- the reviewer

export const fetchReviewEligibility = async (doctorId: number | string) =>
	unwrap<ReviewEligibility>(await apiGet(buildUrl("/me/review-eligibility", { doctorId })), "Could not check whether you can review");

export const createReview = async (body: ReviewInput) => unwrap<MyReview>(await apiPost("/reviews", body), "Could not send your review");

export const updateReview = async (id: number, body: ReviewInput) => unwrap<MyReview>(await apiPut(`/reviews/${id}`, body), "Could not save your review");

export const removeReview = async (id: number) => {
	const response = await apiDelete(`/reviews/${id}`);
	if (!response.ok) throw new Error(response.error || "Could not remove your review");
};

export const fetchMyReviews = async (page: number, size: number): Promise<PageResult<MyReview>> =>
	normalizePage(unwrap<WirePage<MyReview>>(await apiGet(buildUrl("/me/reviews", { page: toWirePage(page), size })), "Could not load your reviews"));

export const reportReview = async (id: number, reason: string, note?: string) => {
	const response = await apiPost(`/reviews/${id}/report`, { reason, note: note || undefined });
	if (!response.ok) throw new Error(response.error || "Could not send your report");
};

// ---- the doctor

export const replyToReview = async (id: number, text: string) => unwrap<PublicReview>(await apiPost(`/reviews/${id}/reply`, { text }), "Could not send your reply");

// ---- moderators

export const fetchModerationQueue = async (reported: boolean, page: number, size: number): Promise<PageResult<ModerationReview>> =>
	normalizePage(
		unwrap<WirePage<ModerationReview>>(await apiGet(buildUrl("/reviews/moderation", { reported, page: toWirePage(page), size })), "Could not load the queue")
	);

export const decideReview = async (id: number, status: ReviewStatus, reason?: string) =>
	unwrap<ModerationReview>(await apiPatch(`/reviews/${id}/status`, { status, reason: reason || undefined }), "Could not save the decision");

export const dismissReports = async (id: number) => unwrap<ModerationReview>(await apiPost(`/reviews/${id}/dismiss-reports`), "Could not dismiss the reports");
