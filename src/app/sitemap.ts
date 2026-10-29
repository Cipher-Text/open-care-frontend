import type { MetadataRoute } from "next";
import { getChunk, getSitemapPlan } from "@/lib/sitemap-data";
import { getBlogPosts } from "@/lib/public-blog";
import { siteUrl } from "@/lib/site";

export const revalidate = 86400;

const STATIC_PATHS = ["", "/hospitals", "/doctors", "/blog", "/ambulances", "/institutions", "/about", "/pricing", "/contact", "/privacy", "/terms"];

export async function generateSitemaps() {
	const { hospitalChunks, doctorChunks } = await getSitemapPlan();
	return Array.from({ length: 1 + hospitalChunks + doctorChunks }, (_, id) => ({ id }));
}

// Next 15 passes a number; later versions pass a promise of a string. Accept both.
export default async function sitemap({ id }: { id: number | Promise<string> }): Promise<MetadataRoute.Sitemap> {
	const index = Number(await id);
	if (index === 0) {
		const staticPages = STATIC_PATHS.map((path) => ({
			url: `${siteUrl}${path}`,
			changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
			priority: path === "" ? 1 : 0.7,
		}));
		// The blog is small (one page of up to 100 posts), so its posts sit with the static pages
		const posts = await getBlogPosts({ size: 100 }).catch(() => ({ content: [] }));
		return [
			...staticPages,
			...posts.content.map((post) => ({
				url: `${siteUrl}/blog/${post.slug}`,
				lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
				changeFrequency: "monthly" as const,
				priority: 0.6,
			})),
		];
	}

	const { hospitalChunks } = await getSitemapPlan();
	const isHospital = index <= hospitalChunks;
	const kind = isHospital ? "hospitals" : "doctors";
	const chunk = isHospital ? index - 1 : index - 1 - hospitalChunks;
	const records = await getChunk(kind, chunk);

	return records.map((record) => ({
		url: `${siteUrl}/${kind}/${record.slug ?? record.id}`,
		lastModified: record.updatedAt ? new Date(record.updatedAt) : undefined,
		changeFrequency: "monthly",
		priority: 0.5,
	}));
}
