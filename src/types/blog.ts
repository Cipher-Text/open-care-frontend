export interface BlogTopic {
	id: number;
	name: string;
	displayName: string;
	category: string;
}

export interface BlogPostSummary {
	id: number;
	slug: string;
	title: string;
	summary?: string | null;
	coverImageUrl?: string | null;
	language: "bn" | "en";
	status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED";
	publishedAt?: string | null;
	authorName: string;
	readingMinutes: number;
	topics: BlogTopic[];
	speciality?: { id: number; name: string; bnName?: string | null } | null;
}

export interface BlogPost extends BlogPostSummary {
	/** HTML cleaned by the backend on every write. */
	bodyHtml: string;
}

export interface BlogPage {
	content: BlogPostSummary[];
	currentPage: number;
	totalItems: number;
	totalPages: number;
}
