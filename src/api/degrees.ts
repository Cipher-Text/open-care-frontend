"use client";

import { Degree, DoctorDegree, AddDoctorDegreeResponse } from "@/types/degrees";
import { apiGet, apiPost } from "@/lib/api-client";

export const fetchDegrees = async (): Promise<Degree[]> => {
	const response = await apiGet<Degree[]>("/degrees");

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch degrees");
	}

	return response.data as Degree[];
};

/**
 * Add or update doctor degrees in batch
 * @param doctorId - The doctor ID
 * @param degrees - Array of degree objects to add/update
 * @returns Response with success status
 */
export const addDoctorDegreesBatch = async (
	doctorId: string | number,
	degrees: DoctorDegree[]
): Promise<AddDoctorDegreeResponse> => {
	const response = await apiPost<AddDoctorDegreeResponse>(
		`/doctors/${doctorId}/degrees/batch`,
		degrees
	);

	if (!response.ok) {
		throw new Error(response.error || "Failed to add doctor degrees");
	}

	return response.data as AddDoctorDegreeResponse;
};

/**
 * Fetch all degrees for a specific doctor
 * @param doctorId - The doctor ID
 * @returns Array of doctor degrees
 */
export const fetchDoctorDegrees = async (
	doctorId: string | number
): Promise<DoctorDegree[]> => {
	const response = await apiGet<DoctorDegree[]>(
		`/doctors/${doctorId}/degrees/all`
	);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctor degrees");
	}

	return response.data as DoctorDegree[];
};
