export type VerificationSubject = "DOCTOR" | "HOSPITAL";
export type RegisterCheckResult = "MATCH" | "MISMATCH" | "NOT_FOUND";
export type VerificationStatus = "NONE" | "DRAFT" | "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "REVOKED" | "WITHDRAWN";

export interface VerificationDocument {
	id: number;
	uploadedAt: string;
}

export interface VerificationEvent {
	type: string;
	fromStatus: string | null;
	toStatus: string | null;
	actor: string | null;
	note: string | null;
	at: string;
}

/** A request to have a doctor or facility verified. Staff responses also carry the reviewer, the requester and the history. */
export interface VerificationCase {
	id: number;
	subjectType: VerificationSubject;
	subjectId: number;
	subjectName: string | null;
	subjectSlug: string | null;
	status: VerificationStatus;
	claimedRegistrationNo: string | null;
	note: string | null;
	createdAt: string | null;
	submittedAt: string | null;
	reviewedAt: string | null;
	decisionReason: string | null;
	documents: VerificationDocument[];
	reviewer?: string | null;
	requestedByProfileId?: number | null;
	requestedByName?: string | null;
	events?: VerificationEvent[];
	/** Staff only, doctor requests: the manual look-up in the BMDC register. */
	registerResult?: RegisterCheckResult | null;
	registerCheckedBy?: string | null;
	registerCheckedAt?: string | null;
	registerNote?: string | null;
}

export interface VerificationStats {
	counts: { subjectType: VerificationSubject; status: VerificationStatus; total: number }[];
	decided: number;
	medianDaysToDecision: number | null;
	averageDaysToDecision: number | null;
}
