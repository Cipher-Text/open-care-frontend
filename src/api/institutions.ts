import { baseUrl } from "@/config/config";
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
  const queryString = buildQueryString(params);
  const response = await fetch(`${baseUrl}/institutions?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch institutions: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const addInstitution = async (
  institutionData: AddInstitutionFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await fetch(`${baseUrl}/institutions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(institutionData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to add institution: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchInstitutionById = async (id: string): Promise<Institution> => {
  const response = await fetch(`${baseUrl}/institutions/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch institution: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const updateInstitution = async (
  id: string,
  institutionData: AddInstitutionFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await fetch(`${baseUrl}/institutions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(institutionData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update institution: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const deleteInstitution = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const response = await fetch(`${baseUrl}/institutions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete institution: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};