import { apiGet, apiPut, buildUrl, unwrap } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type { NutritionistDegree, NutritionistInput, NutritionistResponse } from "@/types/nutritionists";

// ---- staff (the complete profile; for staff who create or delete nutritionists)

export interface AdminNutritionistQuery {
	name?: string;
	isVerified?: boolean;
	page: number;
	size: number;
}

export const fetchAdminNutritionists = async ({ page, ...rest }: AdminNutritionistQuery): Promise<PageResult<NutritionistResponse>> =>
	normalizePage(unwrap<WirePage<NutritionistResponse>>(await apiGet(buildUrl("/admin/nutritionists", { ...rest, page: toWirePage(page) })), "Could not load the nutritionists"));

// ---- the signed-in nutritionist's own record

export const fetchMyNutritionist = async () => unwrap<NutritionistResponse>(await apiGet("/nutritionists/me"), "Could not load your nutritionist profile");

export const updateNutritionist = async (id: number, input: NutritionistInput) =>
	unwrap<NutritionistResponse>(await apiPut(`/nutritionists/${id}`, input), "Could not save your changes");

/** The degrees of a nutritionist (public, newest first). */
export const fetchNutritionistDegrees = async (id: number) => unwrap<NutritionistDegree[]>(await apiGet(`/nutritionists/${id}/degrees`), "Could not load the degrees");

/** The degrees a nutritionist can pick from (the nutrition part of the master list). */
export const fetchNutritionDegreeOptions = async () => unwrap<{ id: number; name: string; abbreviation: string }[]>(await apiGet("/degrees?audience=NUTRITION"), "Could not load the degrees");

/** Institutions whose name contains the text (a few), for the institution box of the degree editor. */
export const searchInstitutionNames = async (text: string) => {
	const page = unwrap<{ content?: { id: number; name: string }[] }>(await apiGet(buildUrl("/institutions", { name: text.trim(), size: 8, page: 0 })), "Could not search");
	return (page.content ?? []).map((i) => ({ id: i.id, name: i.name }));
};
