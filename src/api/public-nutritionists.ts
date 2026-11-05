import { apiGet, buildUrl, unwrap } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type { NutritionistResponse } from "@/types/nutritionists";

export interface NutritionistQuery {
	name?: string;
	districtId?: string;
	page: number;
	size: number;
}

/**
 * The public nutritionist list (`GET /api/nutritionists`: active records, the public profile only). Like the doctor and hospital
 * lists it is a public GET with no token, so a visitor whose sign-in has expired still sees it. Callers pass 1-based pages.
 */
export const fetchPublicNutritionists = async ({ page, ...rest }: NutritionistQuery): Promise<PageResult<NutritionistResponse>> =>
	normalizePage(
		unwrap<WirePage<NutritionistResponse>>(await apiGet(buildUrl("/nutritionists", { ...rest, page: toWirePage(page) }), { includeAuth: false }), "Could not load the nutritionists")
	);
