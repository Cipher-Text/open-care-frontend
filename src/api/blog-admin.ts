import { apiDelete, apiGet, apiPatch, apiPost, apiPut, buildUrl } from "@/lib/api-client";
import { normalizePage, withWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type { BlogPost, BlogPostSummary, BlogTopic } from "@/types/blog";

export interface BlogPostInput {
	title: string;
	/** Empty: the backend builds it from the title. */
	slug?: string;
	summary?: string;
	bodyHtml: string;
	coverImageUrl?: string;
	language: "bn" | "en";
	topics: string[];
	specialityId?: number | null;
}

type Params = { page?: number; size?: number; status?: string; q?: string };

/** Posts of any status. Needs the manage-blog permission; the public routes show published posts only. */
export const fetchAdminBlogPosts = async (params: Params): Promise<PageResult<BlogPostSummary>> => {
	const response = await apiGet<WirePage<BlogPostSummary>>(buildUrl("/admin/blog/posts", withWirePage(params)));
	return normalizePage(response.data);
};

export const fetchAdminBlogPost = async (id: number | string): Promise<BlogPost> =>
	(await apiGet<BlogPost>(`/admin/blog/posts/${id}`)).data as BlogPost;

export const createBlogPost = async (input: BlogPostInput): Promise<BlogPost> =>
	(await apiPost<BlogPost>("/admin/blog/posts", input)).data as BlogPost;

export const updateBlogPost = async (id: number, input: BlogPostInput): Promise<BlogPost> =>
	(await apiPut<BlogPost>(`/admin/blog/posts/${id}`, input)).data as BlogPost;

export const publishBlogPost = async (id: number): Promise<BlogPost> =>
	(await apiPatch<BlogPost>(`/admin/blog/posts/${id}/publish`)).data as BlogPost;

export const unpublishBlogPost = async (id: number): Promise<BlogPost> =>
	(await apiPatch<BlogPost>(`/admin/blog/posts/${id}/unpublish`)).data as BlogPost;

export const deleteBlogPost = async (id: number): Promise<void> => {
	await apiDelete(`/admin/blog/posts/${id}`);
};

/** The topic list is public. */
export const fetchBlogTopics = async (): Promise<BlogTopic[]> =>
	(await apiGet<BlogTopic[]>("/blog/posts/topics")).data ?? [];
