import { baseUrl } from "@/config/config";
import {
	MedicalSpecialitiesListResponse,
	MedicalSpeciality,
} from "@/types/medical-specialities";

interface QueryParams {
	[key: string]: string | number | boolean | undefined | null;
}

// Helper function to build query string
const buildQueryString = (params: QueryParams): string => {
	const queryParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			queryParams.append(key, value.toString());
		}
	});

	return queryParams.toString();
};

export const fetchMedicalSpecialities = async (
	params: QueryParams
): Promise<MedicalSpecialitiesListResponse> => {
	const queryString = buildQueryString(params);
	const response = await fetch(
		`${baseUrl}/medical-specialities?${queryString}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch medical specialities: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();

	// Return the data as is since it now matches our expected format
	return {
		medicalSpecialities: data.medicalSpecialities || [],
		totalItems: data.totalItems || 0,
		totalPages: data.totalPages || 0,
		currentPage: data.currentPage || 0,
		message: "Success",
		status: 200,
	};
};
export const fetchMedicalSpecialityById = async (
	id: number
): Promise<MedicalSpeciality> => {
	const response = await fetch(`${baseUrl}/medical-specialities/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch medical speciality: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

export const fetchAllMedicalSpecialities = async (): Promise<
	MedicalSpeciality[]
> => {
	const response = await fetch(`${baseUrl}/medical-specialities/all`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch medical specialities: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();
	return Array.isArray(data) ? data : [];
};
