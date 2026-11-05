import { apiDelete, apiPost, apiPut, publicGet } from "@/lib/api-client";
import { normalizePage, withWirePage } from "@/lib/pagination";
import { InstitutionListResponse, Institution } from "@/types/institutions";
import { AddInstitutionFormData } from "@/validations/add-institution-schema";

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

export const fetchInstitutions = async (
	params: QueryParams
): Promise<InstitutionListResponse> => {
	const queryString = buildQueryString(withWirePage(params));
	const data = await publicGet(`/institutions?${queryString}`);
	return normalizePage(data);
};

export const addInstitution = async (
	institutionData: AddInstitutionFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
	// staff only: through the shared client, so the login cookie goes with it (a direct call had no token and was always refused)
	return (await apiPost<{ success: boolean; message?: string; data?: unknown }>(`/institutions`, institutionData)).data!;
};

export const fetchInstitutionById = async (
	id: string
): Promise<Institution> => {
	const data = await publicGet(`/institutions/${id}`);
	return data;
};

export const updateInstitution = async (
	id: string,
	institutionData: AddInstitutionFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
	return (await apiPut<{ success: boolean; message?: string; data?: unknown }>(`/institutions/${id}`, institutionData)).data!;
};

export const deleteInstitution = async (
	id: string
): Promise<{ success: boolean; message?: string }> => {
	return (await apiDelete<{ success: boolean; message?: string }>(`/institutions/${id}`)).data ?? { success: true };
};

export const fetchAllInstitutions = async (): Promise<Institution[]> => {
	const data = await publicGet(`/institutions/all`);
	return Array.isArray(data) ? data : [];
};
