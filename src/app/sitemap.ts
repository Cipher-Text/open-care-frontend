import type { MetadataRoute } from "next";
import { getChunk, getSitemapPlan } from "@/lib/sitemap-data";
import { getBlogPosts } from "@/lib/public-blog";
import { siteUrl } from "@/lib/site";

export const revalidate = 86400;

const STATIC_PATHS = ["", "/hospitals", "/doctors", "/blog", "/medical-review-policy", "/ambulances", "/institutions", "/about", "/pricing", "/contact", "/privacy", "/terms"];

/** Pages that exist in Bangla as well; only these list the /bn address and the language alternates. */
const BILINGUAL_PATHS = new Set(["", "/blog", "/hospitals"]);

const alternates = (path: string) => ({ languages: { en: `${siteUrl}${path}`, bn: `${siteUrl}/bn${path}` } });

export async function generateSitemaps() {
	const { hospitalChunks, doctorChunks } = await getSitemapPlan();
	return Array.from({ length: 1 + hospitalChunks + doctorChunks }, (_, id) => ({ id }));
}

// Next 15 passes a number; later versions pass a promise of a string. Accept both.
export default async function sitemap({ id }: { id: number | Promise<string> }): Promise<MetadataRoute.Sitemap> {
	const index = Number(await id);
	if (index === 0) {
		const staticPages = STATIC_PATHS.flatMap((path) => {
			const entry = {
				url: `${siteUrl}${path}`,
				changeFrequency: (path === "" ? "daily" : "weekly") as "daily" | "weekly",
				priority: path === "" ? 1 : 0.7,
			};
			if (!BILINGUAL_PATHS.has(path)) return [entry];
			return [{ ...entry, alternates: alternates(path) }, { ...entry, url: `${siteUrl}/bn${path}`, alternates: alternates(path) }];
		});
		// The blog is small (one page of up to 100 posts), so its posts sit with the static pages
		const posts = await getBlogPosts({ size: 100 }).catch(() => ({ content: [] }));
		return [
			...staticPages,
			...posts.content.flatMap((post) => {
				const entry = {
					url: `${siteUrl}/blog/${post.slug}`,
					lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
					changeFrequency: "monthly" as const,
					priority: 0.6,
					alternates: alternates(`/blog/${post.slug}`),
				};
				return [entry, { ...entry, url: `${siteUrl}/bn/blog/${post.slug}` }];
			}),
		];
	}

	const { hospitalChunks } = await getSitemapPlan();
	const isHospital = index <= hospitalChunks;
	const kind = isHospital ? "hospitals" : "doctors";
	const chunk = isHospital ? index - 1 : index - 1 - hospitalChunks;
	const records = await getChunk(kind, chunk);

	return records.flatMap((record) => {
		const path = `/${kind}/${record.slug ?? record.id}`;
		const entry = {
			url: `${siteUrl}${path}`,
			lastModified: record.updatedAt ? new Date(record.updatedAt) : undefined,
			changeFrequency: "monthly" as const,
			priority: 0.5,
		};
		// Hospital pages exist in Bangla too; doctor pages do not yet (their /bn copy is noindex)
		return isHospital ? [{ ...entry, alternates: alternates(path) }, { ...entry, url: `${siteUrl}/bn${path}`, alternates: alternates(path) }] : [entry];
	});
}
