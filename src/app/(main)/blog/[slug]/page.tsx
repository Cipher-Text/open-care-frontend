import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import BlogCard, { CoverImage, formatPostDate } from "@/components/blog/BlogCard";
import { JsonLd } from "@/components/common/JsonLd";
import { Button } from "@/components/ui/button";
import { getBlogPost, getBlogPosts } from "@/lib/public-blog";
import { blogPath } from "@/lib/paths";
import { siteUrl } from "@/lib/site";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const post = await getBlogPost(slug).catch(() => null);
	if (!post) return { title: "Article not found | Open Care" };
	return {
		title: `${post.title} | Open Care`,
		description: post.summary ?? undefined,
		alternates: { canonical: blogPath(post) },
		openGraph: { type: "article", title: post.title, description: post.summary ?? undefined, url: blogPath(post), publishedTime: post.publishedAt ?? undefined },
	};
}

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;
	const post = await getBlogPost(slug);
	if (!post) notFound();
	if (post.slug !== decodeURIComponent(slug)) permanentRedirect(blogPath(post));

	const related = post.topics[0]
		? (await getBlogPosts({ topic: post.topics[0].name, size: 4 }).catch(() => null))?.content.filter((p) => p.id !== post.id).slice(0, 3) ?? []
		: [];
	const cover = post.coverImageUrl;

	return (
		<div className="min-h-screen bg-background">
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "Article",
					headline: post.title,
					description: post.summary ?? undefined,
					image: cover ?? undefined,
					datePublished: post.publishedAt ?? undefined,
					inLanguage: post.language,
					author: { "@type": "Organization", name: post.authorName },
					publisher: { "@type": "Organization", name: "Open Care", url: siteUrl },
					mainEntityOfPage: `${siteUrl}${blogPath(post)}`,
				}}
			/>
			<article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
				<nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
					<Link href="/blog" className="hover:underline">
						Health articles
					</Link>
				</nav>
				<h1 className="text-2xl font-bold leading-snug sm:text-4xl">{post.title}</h1>
				<p className="mt-3 text-sm text-muted-foreground">
					{post.authorName} · {formatPostDate(post.publishedAt)} · {post.readingMinutes} min read
				</p>
				{post.topics.length > 0 && (
					<ul className="mt-3 flex flex-wrap gap-2">
						{post.topics.map((t) => (
							<li key={t.id}>
								<Link href={`/blog?topic=${encodeURIComponent(t.name)}`} className="rounded-full border px-3 py-1 text-sm hover:bg-muted">
									{t.displayName}
								</Link>
							</li>
						))}
					</ul>
				)}
				{cover && (
					<div className="mt-6 overflow-hidden rounded-lg">
						<CoverImage url={cover} alt="" priority />
					</div>
				)}
				{/* bodyHtml is cleaned by the backend (allow-list) on every write */}
				<div
					className="mt-6 space-y-4 text-lg leading-8 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mt-4 [&_h4]:font-semibold [&_hr]:my-6 [&_li]:ml-6 [&_ol]:list-decimal [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2 [&_ul]:list-disc"
					dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
				/>

				{post.speciality && (
					<div className="mt-8 rounded-lg border bg-muted/50 p-4">
						<p className="mb-3 font-medium">Need to see a doctor about this?</p>
						<Button asChild>
							<Link href={`/doctors?speciality=${post.speciality.id}`}>Find a doctor: {post.speciality.bnName || post.speciality.name}</Link>
						</Button>
					</div>
				)}

				<p className="mt-8 border-t pt-4 text-sm text-muted-foreground">
					This article is for information only and is not medical advice. If you are unwell or worried, see a doctor. In an emergency call{" "}
					<a href="tel:999" className="underline">
						999
					</a>
					.
				</p>
			</article>

			{related.length > 0 && (
				<section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6" aria-label="Related articles">
					<h2 className="mb-4 text-xl font-semibold">Related articles</h2>
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{related.map((p) => (
							<BlogCard key={p.id} post={p} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}
