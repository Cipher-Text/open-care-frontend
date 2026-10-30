import { getTranslations } from "next-intl/server";
import { baseUrl } from "@/config/config";
import AdCard, { type AdData } from "@/components/ads/AdCard";

/**
 * One ad for a position, or nothing. Only ads that are switched on and inside their dates come back from the API, so an
 * empty or failed answer simply renders no box. The page is rebuilt hourly, so a slot rotates at most that often.
 */
export default async function AdSlot({ position }: { position: string }) {
	let ad: AdData | null = null;
	try {
		const response = await fetch(`${baseUrl}/advertisements/active?position=${encodeURIComponent(position)}&limit=1`, {
			headers: { Accept: "application/json" },
			next: { revalidate: 600 },
		});
		if (response.ok) {
			const list = (await response.json()) as AdData[];
			ad = list[0] ?? null;
		}
	} catch {
		ad = null;
	}
	if (!ad) return null;
	const t = await getTranslations("home");
	return <AdCard ad={ad} label={t("sponsored")} />;
}
