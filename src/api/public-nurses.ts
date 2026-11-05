import { apiGet, buildUrl, unwrap } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type { NurseResponse } from "@/types/nurses";

export interface NurseQuery {
	name?: string;
	districtId?: string;
	page: number;
	size: number;
}

/**
 * The public nurse list (`GET /api/nurses`: the public profile only). Like the doctor and hospital lists it is a public GET
 * with no token, so a visitor whose sign-in has expired still sees it. Callers pass 1-based pages.
 */
export const fetchPublicNurses = async ({ page, ...rest }: NurseQuery): Promise<PageResult<NurseResponse>> =>
	normalizePage(
		unwrap<WirePage<NurseResponse>>(await apiGet(buildUrl("/nurses", { ...rest, page: toWirePage(page) }), { includeAuth: false }), "Could not load the nurses")
	);
