import { baseUrl } from "@/config/config";
import {
  AdvertisementTypesResponse,
  AdvertisementsResponse,
} from "@/types/advertisements";

export async function getAdvertisementTypes(
  page: number = 0,
  size: number = 10
): Promise<AdvertisementTypesResponse> {
  const response = await fetch(
    `${baseUrl}/advertisement-types?page=${page}&size=${size}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch advertisement types");
  }
  return response.json();
}

export async function getAdvertisements(
  page: number = 0,
  size: number = 10
): Promise<AdvertisementsResponse> {
  const response = await fetch(
    `${baseUrl}/advertisements?page=${page}&size=${size}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch advertisements");
  }
  return response.json();
}
