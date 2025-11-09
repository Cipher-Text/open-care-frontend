"use client";

import { apiGet, buildUrl } from "@/lib/api-client";
import {
  MedicalSpecialitiesListResponse,
  MedicalSpeciality,
} from "@/types/medical-specialities";

interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

export const fetchMedicalSpecialities = async (
  params: QueryParams = {}
): Promise<MedicalSpecialitiesListResponse> => {
  const url = buildUrl("/medical-specialities", params);
  const response = await apiGet<MedicalSpecialitiesListResponse>(url);

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch medical specialities");
  }

  const data = response.data as MedicalSpecialitiesListResponse;

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
  const response = await apiGet<MedicalSpeciality>(
    `/medical-specialities/${id}`
  );

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch medical speciality");
  }

  return response.data as MedicalSpeciality;
};
