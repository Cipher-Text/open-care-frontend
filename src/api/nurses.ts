import { baseUrl } from "@/config/config";
import { NurseListResponse, Nurse } from "@/types/nurses";

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

export const fetchNurses = async (
  params: QueryParams
): Promise<NurseListResponse> => {
  const queryString = buildQueryString(params);
  const response = await fetch(`${baseUrl}/nurses?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch nurses: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

export const fetchNurseById = async (id: string): Promise<Nurse> => {
  const response = await fetch(`${baseUrl}/nurses/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch nurse: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
