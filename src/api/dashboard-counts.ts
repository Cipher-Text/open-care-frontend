import { apiGet } from "@/lib/api-client";

/** Public directory totals. They are real counts from the API, read with a page size of one. */
export type CountKey = "hospitals" | "doctors" | "nurses" | "institutions" | "ambulances";

const ENDPOINTS: Record<CountKey, string> = {
	hospitals: "/hospitals",
	doctors: "/doctors",
	nurses: "/nurses",
	institutions: "/institutions",
	ambulances: "/ambulances",
};

export async function fetchCounts(keys: CountKey[]): Promise<Partial<Record<CountKey, number>>> {
	const entries = await Promise.all(
		keys.map(async (key) => {
			const response = await apiGet<{ totalItems?: number }>(`${ENDPOINTS[key]}?page=0&size=1`, { includeAuth: false });
			return [key, response.ok ? response.data?.totalItems ?? 0 : undefined] as const;
		})
	);
	return Object.fromEntries(entries.filter(([, value]) => value !== undefined)) as Partial<Record<CountKey, number>>;
}
