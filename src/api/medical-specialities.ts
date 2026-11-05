import { publicGet } from "@/lib/api-client";
import { normalizePage, withWirePage } from "@/lib/pagination";
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
	const queryString = buildQueryString(withWirePage(params));
	const data = await publicGet(`/medical-specialities?${queryString}`);
	return normalizePage(data);
};
export const fetchMedicalSpecialityById = async (
	id: number
): Promise<MedicalSpeciality> => {
	const data = await publicGet(`/medical-specialities/${id}`);
	return data;
};

export const fetchAllMedicalSpecialities = async (): Promise<
	MedicalSpeciality[]
> => {
	const data = await publicGet(`/medical-specialities/all`);
	return Array.isArray(data) ? data : [];
};
