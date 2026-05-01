"use client";

import { apiGet, apiPost } from "@/lib/api-client";
import { DoctorWorkplace } from "@/types/doctors";
import {
	AddDoctorWorkplaceResponse,
	DoctorWorkplaceRequest,
} from "@/types/workplaces";

export const addDoctorWorkplacesBatch = async (
	doctorId: string | number,
	workplaces: DoctorWorkplaceRequest[]
): Promise<AddDoctorWorkplaceResponse> => {
	const response = await apiPost<AddDoctorWorkplaceResponse>(
		`/doctors/${doctorId}/workplaces/batch`,
		workplaces
	);

	if (!response.ok) {
		throw new Error(response.error || "Failed to add doctor workplaces");
	}

	return response.data as AddDoctorWorkplaceResponse;
};

export const fetchDoctorWorkplaces = async (
	doctorId: string | number
): Promise<DoctorWorkplace[]> => {
	const response = await apiGet<DoctorWorkplace[]>(
		`/doctors/${doctorId}/workplaces/all`
	);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctor workplaces");
	}

	return response.data as DoctorWorkplace[];
};
