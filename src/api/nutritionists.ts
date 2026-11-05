import { apiGet, apiPut, buildUrl, unwrap } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type { NutritionistInput, NutritionistResponse } from "@/types/nutritionists";

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
