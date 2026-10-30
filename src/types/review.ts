export interface ReviewReply {
	text: string;
	date: string;
}

export interface PublicReview {
	id: number;
	overall: number;
	scoreExplanation: number | null;
	scoreTime: number | null;
	scoreListening: number | null;
	scoreBehaviour: number | null;
	wouldRecommend: boolean;
	comment: string | null;
	language: string | null;
	date: string | null;
	reply: ReviewReply | null;
}

export interface ReviewSummary {
	count: number;
	/** Null until there are enough published reviews. */
	average: number | null;
	recommendPercent: number | null;
	/** One star first. */
	distribution: number[];
	minimumForAverage: number;
}

export type ReviewStatus = "PENDING" | "PUBLISHED" | "REJECTED" | "REMOVED";

export interface MyReview {
	id: number;
	doctorId: number;
	doctorName: string | null;
	doctorSlug: string | null;
	overall: number;
	scoreExplanation: number | null;
	scoreTime: number | null;
	scoreListening: number | null;
	scoreBehaviour: number | null;
	wouldRecommend: boolean;
	comment: string | null;
	status: ReviewStatus;
	rejectReason: string | null;
	canEdit: boolean;
	createdAt: string;
	publishedAt: string | null;
}

export interface ReviewEligibility {
	eligible: boolean;
	code: string | null;
	message: string | null;
	existingReviewId: number | null;
}

export interface ModerationReview {
	id: number;
	doctorId: number;
	doctorName: string | null;
	reviewerName: string | null;
	overall: number;
	scoreExplanation: number | null;
	scoreTime: number | null;
	scoreListening: number | null;
	scoreBehaviour: number | null;
	wouldRecommend: boolean;
	comment: string | null;
	autoFlags: string | null;
	evidence: string;
	status: ReviewStatus;
	rejectReason: string | null;
	createdAt: string;
	reports: { reason: string; note: string | null; date: string }[];
}

export interface ReviewInput {
	doctorId?: number;
	overall: number;
	scoreExplanation?: number;
	scoreTime?: number;
	scoreListening?: number;
	scoreBehaviour?: number;
	wouldRecommend: boolean;
	comment?: string;
	language?: string;
}
