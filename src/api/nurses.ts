import { normalizePage, withWirePage, type WirePage } from "@/lib/pagination";
import { apiGet, apiPut, buildUrl, unwrap } from "@/lib/api-client";
import { NurseListResponse, Nurse } from "@/types/nurses";

interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

// The administration endpoints return the complete profile (phone, email), so they need a login with a nurse permission.
// The public /nurses routes show the public profile only.
export const fetchNurses = async (
  params: QueryParams
): Promise<NurseListResponse> => {
  const response = await apiGet<WirePage<Nurse>>(
    buildUrl("/admin/nurses", withWirePage(params))
  );
  return normalizePage(response.data);
};

export const fetchNurseById = async (id: string): Promise<Nurse> => {
  const response = await apiGet<Nurse>(`/admin/nurses/${id}`);
  return response.data as Nurse;
};

// ---- the signed-in nurse's own record

export const fetchMyNurse = async () => unwrap<Nurse>(await apiGet("/nurses/me"), "Could not load your nurse profile");

/** A nurse changes their start date and about text; the registration number stays the one staff verified (the server keeps it). */
export const updateMyNurse = async (id: number, input: { startDate: string; description: string }) =>
	unwrap<Nurse>(await apiPut(`/nurses/${id}`, input), "Could not save your changes");
