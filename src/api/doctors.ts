"use client";

import {
	DoctorListResponse,
	Doctor,
	DoctorDetailsResponse,
	DoctorDegreesListResponse,
	AddDoctorDegreeRequest,
} from "@/types/doctors";
import { AddDoctorFormData } from "@/validations/add-doctor-schema";
import { apiGet, apiPost, apiPut, buildUrl } from "@/lib/api-client";

export type { AddDoctorDegreeRequest };

export const fetchDoctors = async (
	params: Record<string, unknown> = {}
): Promise<DoctorListResponse> => {
	const url = buildUrl("/doctors", params);
	const response = await apiGet<DoctorListResponse>(url);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctors");
	}

	return response.data as DoctorListResponse;
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
	const response = await apiGet<Doctor>(`/doctors/${id}`);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctor");
	}

	return response.data as Doctor;
};

export const fetchDoctorDetailsById = async (
	id: number
): Promise<DoctorDetailsResponse> => {
	const url = buildUrl(`/doctors/${id}`, {
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

export const fetchDoctorDegrees = async (
	doctorId: string,
	params: { page?: number; size?: number } = {}
): Promise<DoctorDegreesListResponse> => {
	const url = buildUrl(`/doctors/${doctorId}/degrees`, params);
	const response = await apiGet<DoctorDegreesListResponse>(url);

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch doctor degrees");
	}

	return response.data as DoctorDegreesListResponse;
};

export const addDoctorDegree = async (
	doctorId: string,
	degreeData: AddDoctorDegreeRequest
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
	const response = await apiPost(`/doctors/${doctorId}/degrees`, degreeData);

	if (!response.ok) {
		throw new Error(response.error || "Failed to add doctor degree");
	}

	return response.data as {
		success: boolean;
		message?: string;
		data?: unknown;
	};
};
