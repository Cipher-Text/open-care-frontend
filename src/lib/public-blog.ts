import { baseUrl } from "@/config/config";
import type { BlogPage, BlogPost, BlogTopic } from "@/types/blog";

/**
 * Server-side reads for the public blog. The endpoints are public, so no token is sent; Next caches each
 * response for ten minutes. A missing post returns null (the page shows a 404); any other failure throws.
 */
const REVALIDATE_SECONDS = 10 * 60;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function getJson<T>(path: string): Promise<T | null> {
	const response = await fetch(`${baseUrl}${path}`, {
		headers: { Accept: "application/json" },
		next: { revalidate: REVALIDATE_SECONDS },
	});
	if (response.status === 404 || response.status === 400) return null;
	if (!response.ok) throw new Error(`Blog request failed (${response.status})`);
	return (await response.json()) as T;
}

export interface BlogQuery {
	page?: number;
	size?: number;
	topic?: string;
	q?: string;
	specialityId?: number;
}

export async function getBlogPosts({ page = 0, size = 12, topic, q, specialityId }: BlogQuery = {}): Promise<BlogPage> {
	const params = new URLSearchParams({ page: String(page), size: String(size) });
	if (topic) params.set("topic", topic);
	if (q) params.set("q", q);
	if (specialityId != null) params.set("specialityId", String(specialityId));
	return (await getJson<BlogPage>(`/blog/posts?${params}`)) ?? { content: [], currentPage: 0, totalItems: 0, totalPages: 0 };
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
	const value = decodeURIComponent(slug);
	if (!SLUG_PATTERN.test(value)) return null;
	return getJson<BlogPost>(`/blog/posts/slug/${value}`);
}

export async function getBlogTopics(): Promise<BlogTopic[]> {
	return (await getJson<BlogTopic[]>("/blog/posts/topics")) ?? [];
}
