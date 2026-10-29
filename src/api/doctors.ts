"use client";
import { normalizePage, withWirePage, type WirePage } from "@/lib/pagination";

import {
	DoctorBulkImportResponse,
	DoctorListResponse,
	DoctorResponse,
	Doctor,
	DoctorDetailsResponse,
} from "@/types/doctors";
import { AddDoctorFormData } from "@/validations/add-doctor-schema";
import { apiGet, apiPost, apiPut, buildUrl } from "@/lib/api-client";

export const fetchDoctors = async (
	params: Record<string, unknown> = {}
): Promise<DoctorListResponse> => {
	const url = buildUrl("/doctors", withWirePage(params));
	const response = await apiGet<WirePage<DoctorResponse>>(url, {
		includeAuth: false,
	});

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctors");
	}

	return normalizePage(response.data);
};

/**
 * The doctor list for the administration screen, with phone and email. Only doctor administrators may read it; anyone else
 * (a doctor with only their own record) gets the public list, which shows no private details.
 */
export const fetchAdminDoctors = async (
	params: Record<string, unknown> = {}
): Promise<DoctorListResponse> => {
	try {
		const response = await apiGet<WirePage<DoctorResponse>>(buildUrl("/admin/doctors", withWirePage(params)));
		return normalizePage(response.data);
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("403")) {
			return fetchDoctors(params);
		}
		throw error;
	}
};

export const addDoctor = async (
	doctorData: AddDoctorFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
	const response = await apiPost("/doctors", doctorData);

	if (!response.ok) {
		throw new Error(response.error || "Failed to add doctor");
	}

	return response.data as {
		success: boolean;
		message?: string;
		data?: unknown;
	};
};

export const fetchDoctorById = async (id: string): Promise<Doctor> => {
	const response = await apiGet<Doctor>(`/admin/doctors/${id}`);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctor");
	}

	return response.data as Doctor;
};

export const fetchDoctorDetailsById = async (
	id: number
): Promise<DoctorDetailsResponse> => {
	const url = buildUrl(`/admin/doctors/${id}`, {
		degrees: true,
		workplaces: true,
		associations: true,
	});
	const response = await apiGet<DoctorDetailsResponse>(url);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctor details");
	}

	return response.data as DoctorDetailsResponse;
};

export const updateDoctor = async (
	id: string,
	doctorData: AddDoctorFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
	const response = await apiPut(`/doctors/${id}`, doctorData);

	if (!response.ok) {
		throw new Error(response.error || "Failed to update doctor");
	}

	return response.data as {
		success: boolean;
		message?: string;
		data?: unknown;
	};
};

/**
 * Validates (dryRun = true) or imports (dryRun = false) doctors from a CSV file.
 * Server limits: .csv only, 1 MB, 1000 rows. Existing doctors are skipped, never updated.
 */
export const uploadDoctorsCsv = async (
	file: File,
	dryRun: boolean
): Promise<DoctorBulkImportResponse> => {
	const body = new FormData();
	body.append("file", file);
	const response = await apiPost<DoctorBulkImportResponse>(
		`/doctors/bulk?dryRun=${dryRun}`,
		body
	);

	if (!response.ok) {
		throw new Error(response.error || "Bulk upload failed");
	}

	return response.data as DoctorBulkImportResponse;
};

/** The doctor record of the signed-in person, the one linked to their login. */
export const fetchMyDoctor = async (): Promise<Doctor> => {
	const response = await apiGet<Doctor>("/me/doctor");

	if (!response.ok || !response.data) {
		throw new Error(response.error || "No doctor record is linked to this account");
	}

	return response.data;
};
