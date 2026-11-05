import { publicGet } from "@/lib/api-client";
import { normalizePage, withWirePage } from "@/lib/pagination";
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
  const queryString = buildQueryString(withWirePage(params));
  const data = await publicGet(`/ambulances?${queryString}`);
	return normalizePage(data);
};

export const fetchAmbulanceById = async (id: number): Promise<Ambulance> => {
  const data = await publicGet(`/ambulances/${id}`);
	return data;
};
