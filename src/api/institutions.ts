"use client";

import { apiGet, apiPost, apiPut, buildUrl } from "@/lib/api-client";
import { InstitutionListResponse, Institution } from "@/types/institutions";
import { AddInstitutionFormData } from "@/validations/add-institution-schema";

interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

export const fetchInstitutions = async (
  params: QueryParams = {}
): Promise<InstitutionListResponse> => {
  const url = buildUrl("/institutions", params);
  const response = await apiGet<InstitutionListResponse>(url);

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch institutions");
  }

  return response.data as InstitutionListResponse;
};

export const addInstitution = async (
  institutionData: AddInstitutionFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await apiPost("/institutions", institutionData);

  if (!response.ok) {
    throw new Error(response.error || "Failed to add institution");
  }

  return response.data as {
    success: boolean;
    message?: string;
    data?: unknown;
  };
};

export const fetchInstitutionById = async (id: string | number): Promise<Institution> => {
  const response = await apiGet<Institution>(`/institutions/${id}`);

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch institution");
  }

  return response.data as Institution;
};

export const updateInstitution = async (
  id: string,
  institutionData: AddInstitutionFormData
): Promise<{ success: boolean; message?: string; data?: unknown }> => {
  const response = await apiPut(`/institutions/${id}`, institutionData);

  if (!response.ok) {
    throw new Error(response.error || "Failed to update institution");
  }

  return response.data as {
    success: boolean;
    message?: string;
    data?: unknown;
  };
};

export const deleteInstitution = async (
  id: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await apiPost(`/institutions/${id}`, {});

  if (!response.ok) {
    throw new Error(response.error || "Failed to delete institution");
  }

  return response.data as { success: boolean; message?: string };
};
