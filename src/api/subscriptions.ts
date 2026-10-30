import { apiGet, apiPatch, apiPost, buildUrl } from "@/lib/api-client";

export type PlanAudience = "DOCTOR" | "HOSPITAL" | "CLINIC" | "PATIENT";
export type PlanTier = "FREE" | "PLUS" | "PRO";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED";

export interface Subscription {
	id: number;
	audience: PlanAudience;
	tier: PlanTier;
	subjectId: number;
	status: SubscriptionStatus;
	startedAt: string;
	endsAt: string | null;
	cancelledAt: string | null;
	assignedBy: string | null;
}

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

/** A subject's plans, newest first. Needs `manage-subscriptions`. */
export const fetchSubscriptionHistory = async (audience: PlanAudience, subjectId: number) =>
	unwrap<Subscription[]>(await apiGet(buildUrl("/subscriptions", { audience, subjectId })), "Could not load the plan history");

/** Puts the subject on a plan; FREE only ends the paid plan (the answer is empty). `endsAt` is a local date-time without a zone. */
export const assignPlan = async (body: { audience: PlanAudience; subjectId: number; tier: PlanTier; endsAt?: string }) =>
	unwrap<Subscription | null>(await apiPost("/subscriptions", body), "Could not assign the plan");

export const cancelSubscription = async (id: number) =>
	unwrap<Subscription>(await apiPatch(`/subscriptions/${id}/cancel`), "Could not end the plan");
