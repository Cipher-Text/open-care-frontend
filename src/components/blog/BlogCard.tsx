import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { blogPath } from "@/lib/paths";
import type { BlogPostSummary } from "@/types/blog";

export function formatPostDate(value?: string | null) {
	if (!value) return null;
	// The API sends a date-time without a zone; show its calendar date as stored, so server and browser agree
	return new Date(`${value.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function CoverImage({ url, alt, priority = false }: { url?: string | null; alt: string; priority?: boolean }) {
	if (!url) return <div className="aspect-[16/9] w-full bg-muted" aria-hidden />;
	return (
		<Image
			src={url}
			alt={alt}
			width={1200}
			height={675}
			priority={priority}
			// Local development serves covers over http, which the image optimizer does not accept
			unoptimized={!url.startsWith("https://")}
			className="aspect-[16/9] w-full object-cover"
		/>
	);
}

export default function BlogCard({ post }: { post: BlogPostSummary }) {
	return (
		<Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
			<Link href={blogPath(post)} className="flex h-full flex-col">
				<CoverImage url={post.coverImageUrl} alt="" />
				<CardContent className="flex flex-1 flex-col gap-2 p-4">
					<div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
						{post.topics[0] && <span className="font-medium text-primary">{post.topics[0].displayName}</span>}
						<span>{formatPostDate(post.publishedAt)}</span>
						<span>{post.readingMinutes} min read</span>
					</div>
					<h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
					{post.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{post.summary}</p>}
				</CardContent>
			</Link>
		</Card>
	);
}
