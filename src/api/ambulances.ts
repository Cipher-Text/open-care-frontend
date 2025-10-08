import { AmbulancesListResponse, Ambulance } from "@/types/ambulances";

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

export const fetchAmbulances = async (
  params: QueryParams
): Promise<AmbulancesListResponse> => {
  // Note: The API endpoint is on port 6700
  const apiBaseUrl = "http://localhost:6700/api";
  const queryString = buildQueryString(params);
  const response = await fetch(`${apiBaseUrl}/ambulances?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ambulances: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  // Return the data as is since it matches our expected format
  return {
    ambulances: data.ambulances || [],
    totalItems: data.totalItems || 0,
    totalPages: data.totalPages || 0,
    currentPage: data.currentPage || 0,
    message: "Success",
    status: 200,
  };
};

export const fetchAmbulanceById = async (id: number): Promise<Ambulance> => {
  const apiBaseUrl = "http://localhost:6700/api";
  const response = await fetch(`${apiBaseUrl}/ambulances/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ambulance: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
