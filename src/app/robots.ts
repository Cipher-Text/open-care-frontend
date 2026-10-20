import type { MetadataRoute } from "next";
import { getSitemapPlan } from "@/lib/sitemap-data";
import { siteUrl } from "@/lib/site";

export const revalidate = 86400;

export default async function robots(): Promise<MetadataRoute.Robots> {
	const { hospitalChunks, doctorChunks } = await getSitemapPlan();
	const total = 1 + hospitalChunks + doctorChunks;
	return {
		rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/login", "/signup", "/logout", "/auth"] }],
		sitemap: Array.from({ length: total }, (_, id) => `${siteUrl}/sitemap/${id}.xml`),
	};
}
