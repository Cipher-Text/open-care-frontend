import { normalizePage, withWirePage } from "@/lib/pagination";
import { AssociationsListResponse, Association } from "@/types/associations";
import { AddAssociationFormData } from "@/validations/add-association-schema";
import { apiPost, apiPut, publicGet } from "@/lib/api-client";

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

export const fetchAssociations = async (
  params: QueryParams
): Promise<AssociationsListResponse> => {
  const queryString = buildQueryString(withWirePage(params));
  const data = await publicGet(`/associations?${queryString}`);
	return normalizePage(data);
};

export const fetchAssociationById = async (
  id: number
): Promise<Association> => {
  const data = await publicGet(`/associations/${id}`);
	return data;
};

export const addAssociation = async (
  data: AddAssociationFormData
): Promise<Association> => {
  const response = await apiPost<Association>("/associations", data);

  if (!response.data) {
    throw new Error("Failed to add association");
  }

  return response.data;
};

export const updateAssociation = async (
  id: number,
  data: AddAssociationFormData
): Promise<Association> => {
  const response = await apiPut<Association>(`/associations/${id}`, data);

  if (!response.ok || !response.data) {
    throw new Error(response.error || "Failed to update association");
  }

  return response.data;
};

export const fetchAssociationTypes = async (): Promise<
  Array<{ value: string; displayName: string; bnName: string }>
> => {
  const data = await publicGet(`/association-types`);
	return data;
};
