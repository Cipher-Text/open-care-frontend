import { baseUrl } from "@/config/config";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";
import {
  Advertisement,
  AdvertisementInput,
  AdvertisementPositionOption,
  AdvertisementType,
  AdvertisementTypeInput,
  AdvertisementTypesResponse,
  AdvertisementsResponse,
  AgeGroupOption,
  GenderOption,
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
  // every ad, switched off or out of date too: staff only, so the login is sent
  const response = await apiGet<AdvertisementsResponse>(`/advertisements?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error(response.error || "Failed to fetch advertisements");
  }
  return response.data as AdvertisementsResponse;
}

// ---- Writes (need the create/update/delete-advertisement[-type] permissions) ----

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
  if (!response.ok) throw new Error(response.error || fallback);
  return response.data as T;
};

export const createAdvertisementType = async (input: AdvertisementTypeInput) =>
  unwrap<AdvertisementType>(
    await apiPost<AdvertisementType>("/advertisement-types", input),
    "Failed to create advertisement type"
  );

export const updateAdvertisementType = async (id: number, input: AdvertisementTypeInput) =>
  unwrap<AdvertisementType>(
    await apiPut<AdvertisementType>(`/advertisement-types/${id}`, input),
    "Failed to update advertisement type"
  );

export const deleteAdvertisementType = async (id: number) => {
  unwrap(await apiDelete(`/advertisement-types/${id}`), "Failed to delete advertisement type");
};

export const createAdvertisement = async (input: AdvertisementInput) =>
  unwrap<Advertisement>(
    await apiPost<Advertisement>("/advertisements", input),
    "Failed to create advertisement"
  );

export const updateAdvertisement = async (id: number, input: AdvertisementInput) =>
  unwrap<Advertisement>(
    await apiPut<Advertisement>(`/advertisements/${id}`, input),
    "Failed to update advertisement"
  );

export const deleteAdvertisement = async (id: number) => {
  unwrap(await apiDelete(`/advertisements/${id}`), "Failed to delete advertisement");
};

// ---- Option lists for the forms (public, cached by the callers) ----

export const getAdvertisementPositions = async () =>
  unwrap<AdvertisementPositionOption[]>(
    await apiGet<AdvertisementPositionOption[]>("/advertisement-positions", { includeAuth: false }),
    "Failed to load positions"
  );

export const getAgeGroups = async () =>
  unwrap<AgeGroupOption[]>(
    await apiGet<AgeGroupOption[]>("/age-groups", { includeAuth: false }),
    "Failed to load age groups"
  );

export const getGenderOptions = async () =>
  unwrap<GenderOption[]>(
    await apiGet<GenderOption[]>("/gender", { includeAuth: false }),
    "Failed to load genders"
  );

export const getAllAdvertisementTypes = async () =>
  unwrap<AdvertisementType[]>(
    await apiGet<AdvertisementType[]>("/advertisement-types/all", { includeAuth: false }),
    "Failed to load advertisement types"
  );
