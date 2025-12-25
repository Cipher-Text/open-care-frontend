export interface DoctorWorkplaceRequest {
	id?: number;
	doctorId: number;
	medicalSpecialityId: number;
	institutionId?: number | null;
	hospitalId?: number | null;
	doctorPosition?: string | null;
	teacherPosition?: string | null;
	startDate: string;
	endDate: string;
	description?: string;
	update?: boolean;
	endDateValid: boolean;
}

export interface AddDoctorWorkplaceResponse {
	success: boolean;
	message?: string;
	data?: unknown;
}
