export type ConsentStatus = "PENDING" | "APPROVED" | "DENIED" | "EXPIRED" | "CANCELLED";

export interface PatientLookup {
	profileId: number;
	name: string | null;
	maskedPhone: string | null;
	age: number | null;
	gender: string | null;
}

export interface ConsentRequest {
	id: number;
	status: ConsentStatus;
	expiresAt: string;
	patientName: string | null;
	maskedPhone: string | null;
	grantId: number | null;
	grantExpiresAt: string | null;
	attemptsLeft: number;
	/** Only present when the backend runs with app.consent.expose-dev-code (development). */
	devCode: string | null;
}

export interface DoctorGrant {
	grantId: number;
	patientProfileId: number;
	patientName: string | null;
	patientAge: number | null;
	patientGender: string | null;
	grantedAt: string;
	expiresAt: string;
}

export interface PatientConsentView {
	id: number;
	doctorName: string | null;
	doctorBmdcNo: string | null;
	doctorSpecializations: string | null;
	purpose: string;
	requestedAt: string;
	expiresAt: string;
}

export interface PatientGrantView {
	id: number;
	doctorName: string | null;
	doctorBmdcNo: string | null;
	scope: string;
	grantedAt: string;
	expiresAt: string;
}
