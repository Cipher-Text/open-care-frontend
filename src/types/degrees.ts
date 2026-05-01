/**
 * Degree type classification
 */
export interface DegreeType {
	value: string;
	displayName: string;
	banglaName: string;
}

/**
 * Basic degree information
 */
export interface Degree {
	id: number;
	name: string;
	abbreviation: string;
	degreeType: DegreeType;
}

/**
 * Doctor degree record
 */
export interface DoctorDegree {
	id?: number;
	doctorId: number;
	degreeId: number;
	medicalSpecialityId: number;
	institutionId: number;
	startDate: string;
	endDate: string;
	grade: string;
	description: string;
	update?: boolean;
	endDateValid: boolean;
}

/**
 * Request for batch adding/updating doctor degrees
 */
export interface AddDoctorDegreeBatchRequest {
	degrees: DoctorDegree[];
}

/**
 * Response from adding doctor degrees
 */
export interface AddDoctorDegreeResponse {
	success: boolean;
	message?: string;
	data?: unknown;
}
