export type ContributionKind = "DOCTOR" | "NURSE" | "HOSPITAL" | "AMBULANCE" | "BLOG" | "HOSPITAL_TEST_REVIEW" | "MEDICAL_CAMP" | "FREE_CONSULTATION";
export type ContributionStatus = "PENDING" | "APPROVED" | "REJECTED" | "WITHDRAWN";

/** A proposal. The details, the reviewer and the contributor are present only in staff responses. */
export interface Contribution {
	id: number;
	kind: ContributionKind;
	status: ContributionStatus;
	subjectName: string | null;
	note: string | null;
	createdSubjectId: number | null;
	decisionReason: string | null;
	pointsAwarded: number;
	submittedAt: string | null;
	reviewedAt: string | null;
	reviewer?: string | null;
	contributorProfileId?: number | null;
	contributorName?: string | null;
	data?: Record<string, unknown> | null;
}

/** A person's score and level (0 before the first point). The words come from `levelLabel`. */
export interface ContributionSummary {
	points: number;
	level: number;
	maxLevel: number;
	/** Null at the top level. */
	pointsToNextLevel: number | null;
	approved: number;
	pending: number;
	rejected: number;
}

export interface DoctorContributionSummary extends ContributionSummary {
	/** False unless the person is a verified doctor. */
	eligible: boolean;
}

/** The fields a person may propose for each kind. Required ones are what "enough information" means. */
export interface DoctorData { name: string; bnName?: string; gender: string; bmdcNo: string; specializations: string; degrees?: string; phone?: string; address?: string; districtId: number; upazilaId?: number }
export interface NurseData { name: string; bnName?: string; gender: string; bnmcNo: string; description?: string; phone?: string; address?: string; districtId: number; upazilaId?: number }
export interface HospitalData { name: string; bnName?: string; hospitalType: string; organizationType: string; numberOfBed: number; districtId: number; upazilaId?: number; address: string; phone?: string; email?: string; websiteUrl?: string; lat?: number; lon?: number; registrationCode?: string }
export interface AmbulanceData { vehicleNumber: string; type: string; driverName?: string; driverPhone: string; districtId: number; upazilaId?: number; hospitalId?: number }

export interface ContributionSubmit {
	kind: ContributionKind;
	doctor?: DoctorData;
	nurse?: NurseData;
	hospital?: HospitalData;
	ambulance?: AmbulanceData;
	blog?: Record<string, unknown>;
	hospitalTestReview?: Record<string, unknown>;
	medicalCamp?: Record<string, unknown>;
	freeConsultation?: Record<string, unknown>;
	note?: string;
}
