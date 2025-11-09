"use client";

import { apiGet } from "@/lib/api-client";

export interface DegreeType {
  value: string;
  displayName: string;
  banglaName: string;
}

export interface Degree {
  id: number;
  name: string;
  abbreviation: string;
  degreeType: DegreeType;
}

export interface DegreesListResponse {
  degrees?: Degree[];
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string;
  status?: number;
}

export const fetchDegrees = async (): Promise<Degree[]> => {
  const response = await apiGet<Degree[]>("/degrees");

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch degrees");
  }

  // Handle both array response and paginated response
  if (Array.isArray(response.data)) {
    return response.data;
  }

  const paginatedData = response.data as unknown as DegreesListResponse;
  return paginatedData.degrees || [];
};

export const fetchDegreeById = async (id: number): Promise<Degree> => {
  const response = await apiGet<Degree>(`/degrees/${id}`);

  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch degree");
  }

  return response.data as Degree;
};
