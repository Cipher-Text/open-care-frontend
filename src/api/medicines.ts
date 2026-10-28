"use client";

import { normalizePage, withWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import { apiGet, buildUrl } from "@/lib/api-client";

export interface Medicine {
	id: number;
	brandName: string;
	generic: string | null;
	dosageForm: string | null;
	strength: string | null;
	manufacturer: string | null;
}

/** One page of the medicine catalogue; `page` is 1-based like the other lists. */
export const fetchMedicines = async (params: { term?: string; manufacturer?: string; page: number; size: number }): Promise<PageResult<Medicine>> => {
	const response = await apiGet<WirePage<Medicine>>(buildUrl("/medicines/basic", withWirePage(params)), { includeAuth: false });
	if (!response.ok) throw new Error(response.error || "Failed to fetch medicines");
	return normalizePage(response.data);
};

/** Every company in the catalogue, A to Z. */
export const fetchManufacturers = async (): Promise<string[]> => {
	const response = await apiGet<string[]>("/medicines/manufacturers", { includeAuth: false });
	if (!response.ok) throw new Error(response.error || "Failed to fetch companies");
	return response.data ?? [];
};
