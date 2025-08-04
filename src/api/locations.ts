import { baseUrl } from "@/config/config";
import {
	DivisionResponse,
	DistrictResponse,
	UpazilaResponse,
	UnionResponse,
} from "@/types/locations";

export const fetchDivisions = async (): Promise<DivisionResponse> => {
	const response = await fetch(`${baseUrl}/divisions`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch divisions: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

export const fetchDistricts = async (): Promise<DistrictResponse> => {
	const response = await fetch(`${baseUrl}/districts`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch districts: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

export const fetchUpazilas = async (): Promise<UpazilaResponse> => {
	const response = await fetch(`${baseUrl}/upazilas`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch upazilas: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

export const fetchUnionsByUpazila = async (
	upazilaId: string | number
): Promise<UnionResponse> => {
	const response = await fetch(`${baseUrl}/upazilas/${upazilaId}/unions`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch unions: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};
