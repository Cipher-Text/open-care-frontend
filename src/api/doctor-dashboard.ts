import { apiGet } from "@/lib/api-client";

export interface Kpi {
	current: number;
	previous: number;
	/** Null when the previous period had nothing to compare with. */
	changePercent: number | null;
}

export interface LabelCount {
	label: string;
	total: number;
}

export interface DoctorDashboard {
	generatedAt: string;
	periodDays: number;
	prescriptions: Kpi;
	patients: Kpi;
	returningPatients: number;
	consents: {
		requested: number;
		approved: number;
		denied: number;
		expired: number;
		cancelled: number;
		waiting: number;
		approvalRatePercent: number | null;
	};
	access: { activeGrants: number; expiringWithin24h: number };
	weeklyPrescriptions: { weekStart: string; prescriptions: number; patients: number }[];
	topDiagnoses: LabelCount[];
	topMedicines: LabelCount[];
	followUps: {
		overdue: number;
		dueSoon: number;
		items: { prescriptionId: number; prescriptionNo: string; patientName: string; dueDate: string; overdue: boolean }[];
	};
	readiness: { verified: boolean; active: boolean; completenessPercent: number; missing: string[] };
}

/** The signed-in doctor's own practice figures. */
export const fetchDoctorDashboard = async (): Promise<DoctorDashboard> => {
	const response = await apiGet<DoctorDashboard>("/me/doctor-dashboard");
	if (!response.ok || !response.data) throw new Error(response.error || "Failed to load your dashboard");
	return response.data;
};
