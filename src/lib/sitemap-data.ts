import { baseUrl } from "@/config/config";

/**
 * Data for sitemap.ts and robots.ts. Each sitemap file lists up to CHUNK_SIZE records (the
 * protocol allows 50,000 URLs per file). Responses are cached for a day by Next, so crawlers
 * never put load on the API.
 */
// 1,000 records is about 1.4 MB, under the 2 MB limit of Next's data cache, so each page is cached; 5,000 was not
export const CHUNK_SIZE = 1000;
const REVALIDATE_SECONDS = 24 * 60 * 60;

export type DirectoryKind = "hospitals" | "doctors";

interface Page {
	content?: { id: number; updatedAt?: string | null }[];
	totalItems?: number;
}

async function getPage(kind: DirectoryKind, page: number, size: number): Promise<Page> {
	try {
		const response = await fetch(`${baseUrl}/${kind}?page=${page}&size=${size}`, {
			headers: { Accept: "application/json" },
			next: { revalidate: REVALIDATE_SECONDS },
		});
		return response.ok ? ((await response.json()) as Page) : {};
	} catch {
		return {};
	}
}

export async function countRecords(kind: DirectoryKind): Promise<number> {
	return (await getPage(kind, 0, 1)).totalItems ?? 0;
}

export async function getChunk(kind: DirectoryKind, index: number) {
	return (await getPage(kind, index, CHUNK_SIZE)).content ?? [];
}

/** Sitemap ids: 0 is the static pages, then hospitals chunks, then doctors chunks. */
export async function getSitemapPlan() {
	const [hospitals, doctors] = await Promise.all([countRecords("hospitals"), countRecords("doctors")]);
	return {
		hospitalChunks: Math.ceil(hospitals / CHUNK_SIZE),
		doctorChunks: Math.ceil(doctors / CHUNK_SIZE),
	};
}
