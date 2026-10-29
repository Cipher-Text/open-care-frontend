import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/format";
import { blogPath } from "@/lib/paths";
import type { BlogPostSummary } from "@/types/blog";

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
	const t = useTranslations("blog");
	const locale = useLocale();
	return (
		<Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
			<Link href={blogPath(post)} className="flex h-full flex-col">
				<CoverImage url={post.coverImageUrl} alt="" />
				<CardContent className="flex flex-1 flex-col gap-2 p-4">
					<div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
						{post.topics[0] && <span className="font-medium text-primary">{post.topics[0].displayName}</span>}
						<span>{formatDate(post.publishedAt, locale)}</span>
						<span>{t("minRead", { minutes: post.readingMinutes })}</span>
					</div>
					<h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
					{post.summary && <p className="line-clamp-3 text-sm text-muted-foreground">{post.summary}</p>}
				</CardContent>
			</Link>
		</Card>
	);
}
