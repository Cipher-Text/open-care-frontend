export type MealInstruction = "BEFORE_MEAL" | "AFTER_MEAL" | "WITH_MEAL" | "ANY_TIME";

export interface PrescriptionLine {
	id?: number;
	medicineId?: number | null;
	medicineName: string;
	dosage?: string | null;
	frequency: string;
	duration: string;
	mealInstruction?: MealInstruction | null;
	instructions?: string | null;
}

export interface PrescriptionSummary {
	id: number;
	prescriptionNo: string;
	prescriptionDate: string;
	patientName: string;
	patientAge: number | null;
	patientGender: string | null;
	patientPhone: string | null;
	diagnosis: string;
	medicineCount: number;
	hospitalName: string | null;
	/** The prescription this one replaced, and the one that replaced this one (null while it stands). */
	replacesId?: number | null;
	supersededById?: number | null;
}

export interface Prescription {
	id: number;
	prescriptionNo: string;
	prescriptionDate: string;
	updatedAt: string | null;
	/** Whether the doctor can still edit it, and until when. Absent on older responses, which mean editable. */
	editable?: boolean;
	editableUntil?: string | null;
	/** A prescription that could no longer be edited is corrected by a new one: these link the two. */
	replacesId?: number | null;
	replacesNo?: string | null;
	supersededById?: number | null;
	supersededByNo?: string | null;
	supersededAt?: string | null;
	doctor: {
		id: number;
		name: string | null;
		bnName: string | null;
		bmdcNo: string | null;
		degrees: string | null;
		specializations: string | null;
	};
	hospital: { id: number; name: string; address: string | null; phone: string | null } | null;
	patientProfileId: number | null;
	patientName: string;
	patientAge: number | null;
	patientGender: string | null;
	patientPhone: string | null;
	chiefComplaint: string | null;
	weightKg: number | null;
	temperatureCelsius: number | null;
	bloodPressureSystolic: number | null;
	bloodPressureDiastolic: number | null;
	pulseRate: number | null;
	diagnosis: string;
	investigations: string | null;
	advice: string | null;
	nextVisitDate: string | null;
	medicines: PrescriptionLine[];
}

export interface DoctorContext {
	doctorId: number;
	name: string | null;
	bmdcNo: string | null;
	degrees: string | null;
	specializations: string | null;
	hospitals: { id: number; name: string }[];
}

export interface MedicineSuggestion {
	id: number;
	brandName: string;
	strength: string | null;
	dosageForm: string | null;
	generic: string | null;
	manufacturer: string | null;
}

export interface PrescriptionInput {
	patientProfileId: number;
	hospitalId?: number;
	chiefComplaint?: string;
	weightKg?: number;
	temperatureCelsius?: number;
	bloodPressureSystolic?: number;
	bloodPressureDiastolic?: number;
	pulseRate?: number;
	diagnosis: string;
	investigations?: string;
	advice?: string;
	nextVisitDate?: string;
	medicines: {
		medicineId?: number;
		medicineName?: string;
		dosage?: string;
		frequency: string;
		duration: string;
		mealInstruction?: MealInstruction;
		instructions?: string;
	}[];
}

/** An earlier version of a prescription, kept by an edit inside the edit window. */
export interface PrescriptionRevision {
	revisionNo: number;
	editedAt: string;
	editedByDoctorId: number;
	/** The prescription as it was before that edit. */
	snapshot: Prescription;
}
