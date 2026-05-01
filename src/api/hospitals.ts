"use client";

import { ICommonEnum } from "@/types/common";
import {
	HospitalListResponse,
	Hospital,
	HospitalDetailsResponse,
} from "@/types/hospitals";
import { AddHospitalFormData } from "@/validations/add-hospital-schema";
import { apiGet, apiPost, apiPut, buildUrl } from "@/lib/api-client";

export const fetchHospitals = async (
	params: Record<string, unknown> = {}
): Promise<HospitalListResponse> => {
	const url = buildUrl("/hospitals", params);
	const response = await apiGet<HospitalListResponse>(url);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch hospitals");
	}

	return response.data as HospitalListResponse;
};

export const fetchAllHospitals = async (): Promise<Hospital[]> => {
	const response = await apiGet<Hospital[] | { data?: Hospital[] }>(
		"/hospitals/all",
		{
			includeAuth: false,
		}
	);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch hospitals");
	}

	const data = response.data;
	return Array.isArray(data) ? data : data?.data || [];
};

export const addHospital = async (
	hospitalData: AddHospitalFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
	const response = await apiPost("/hospitals", hospitalData);

	if (!response.ok) {
		throw new Error(response.error || "Failed to add hospital");
	}

	return response.data as {
		success: boolean;
		message?: string;
		data?: unknown;
	};
};

export const fetchHospitalById = async (id: string): Promise<Hospital> => {
	const response = await apiGet<Hospital>(`/hospitals/${id}`);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch hospital");
	}

	return response.data as Hospital;
};

export const fetchHospitalDetailsById = async (
	id: number
): Promise<HospitalDetailsResponse> => {
	const url = buildUrl(`/hospitals/${id}`, {
		doctors: true,
		tests: true,
		amenities: true,
	});
	const response = await apiGet<HospitalDetailsResponse>(url);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch hospital details");
	}

	return response.data as HospitalDetailsResponse;
};

export const updateHospital = async (
	id: string,
	hospitalData: AddHospitalFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
	const response = await apiPut(`/hospitals/${id}`, hospitalData);

	if (!response.ok) {
		throw new Error(response.error || "Failed to update hospital");
	}

	return response.data as {
		success: boolean;
		message?: string;
		data?: unknown;
	};
};

export const fetchHospitalTypes = async (): Promise<ICommonEnum[]> => {
	const response = await apiGet<ICommonEnum[]>("/hospital-types");

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch hospital types");
	}

	return response.data as ICommonEnum[];
};

export const fetchOrganizationTypes = async (): Promise<ICommonEnum[]> => {
	const response = await apiGet<ICommonEnum[]>("/organization-types");

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch organization types");
	}

	return response.data as ICommonEnum[];
};
