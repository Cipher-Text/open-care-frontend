"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Value used by Radix Select (which cannot hold "") for "no filter". */
export const ALL = "all";

/**
 * Reads and writes list filters in the URL so results can be shared and
 * bookmarked, and the back button works. Changing any filter resets `page`.
 */
export function useUrlParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const get = useCallback(
		(key: string) => searchParams.get(key) ?? "",
		[searchParams]
	);

	const set = useCallback(
		(updates: Record<string, string | undefined>) => {
			const next = new URLSearchParams(searchParams.toString());
			Object.entries(updates).forEach(([key, value]) => {
				if (value === undefined || value === "" || value === ALL) {
					next.delete(key);
				} else {
					next.set(key, value);
				}
			});
			if (!("page" in updates)) next.delete("page");
			const qs = next.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[router, pathname, searchParams]
	);

	const clear = useCallback(() => {
		router.replace(pathname, { scroll: false });
	}, [router, pathname]);

	const hasFilters = Array.from(searchParams.keys()).some((k) => k !== "page");

	return { get, set, clear, hasFilters };
}

export function parsePage(value: string): number {
	const n = parseInt(value, 10);
	return Number.isFinite(n) && n > 0 ? n : 1;
}
