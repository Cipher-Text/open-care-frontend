import { PageResult } from "@/types/common";

/**
 * The backend's PageResponse<T>: `{ content, currentPage, totalItems, totalPages }`,
 * with `currentPage` counted from 0. The UI counts pages from 1, so every list
 * fetcher converts the request page with `toWirePage` and the response with
 * `normalizePage`. Keep this the only place that knows about the offset.
 */
export interface WirePage<T> {
	content?: T[] | null;
	currentPage?: number | null;
	totalItems?: number | null;
	totalPages?: number | null;
}

/** 1-based UI page -> 0-based API page. */
export function toWirePage(page: number | string | undefined | null): number {
	const n = Number(page ?? 1);
	return Number.isFinite(n) && n > 1 ? Math.floor(n) - 1 : 0;
}

/** Backend page -> UI page result (1-based `currentPage`, never undefined). */
export function normalizePage<T>(raw: WirePage<T> | null | undefined): PageResult<T> {
	return {
		content: raw?.content ?? [],
		currentPage: (raw?.currentPage ?? 0) + 1,
		totalItems: raw?.totalItems ?? 0,
		totalPages: raw?.totalPages ?? 0,
	};
}

/** Copy of `params` with `page` converted to the API's 0-based value. */
export function withWirePage<P extends Record<string, unknown>>(params: P): P {
	return "page" in params ? { ...params, page: toWirePage(params.page as number) } : params;
}
