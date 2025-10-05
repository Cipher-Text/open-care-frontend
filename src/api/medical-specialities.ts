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
  params?: QueryParams
): Promise<MedicalSpecialitiesListResponse> => {
  const queryString = params ? buildQueryString(params) : "";
  const url = queryString
    ? `${baseUrl}/medical-specialities?${queryString}`
    : `${baseUrl}/medical-specialities`;

  const response = await fetch(url, {
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

  // Transform the data to match our expected response format
  // Filter based on client-side params if needed
  let specialities = Array.isArray(data) ? data : [];

  // Apply client-side filtering if params exist
  if (params?.search) {
    const searchTerm = params.search.toString().toLowerCase();
    specialities = specialities.filter(
      (item: MedicalSpeciality) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.bnName.toLowerCase().includes(searchTerm)
    );
  }

  return {
    specialities,
    totalItems: specialities.length,
    totalPages: 1,
    currentPage: 1,
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
