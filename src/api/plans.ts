import { baseUrl } from "@/config/config";
import type { ApiPlan } from "@/config/pricing-plans";

const REVALIDATE_SECONDS = 60 * 60;

/**
 * The plan catalogue for the public pricing page, fetched on the server and cached for an hour (the same way as the
 * home page numbers). Null when the API cannot be reached, so the page says prices are unavailable instead of showing old ones.
 */
export async function getPlans(): Promise<ApiPlan[] | null> {
	try {
		const response = await fetch(`${baseUrl}/plans`, { next: { revalidate: REVALIDATE_SECONDS } });
		if (!response.ok) return null;
		return (await response.json()) as ApiPlan[];
	} catch {
		return null;
	}
}
