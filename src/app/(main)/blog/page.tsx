import type { Metadata } from "next";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import PageHero from "@/components/common/PageHero";
import { getBlogPosts, getBlogTopics } from "@/lib/public-blog";

export const revalidate = 600;

export const metadata: Metadata = {
	title: "Health articles | Open Care",
	description: "Plain-language health articles in Bangla for people in Bangladesh: symptoms, tests, hospitals and when to see a doctor.",
	alternates: { canonical: "/blog" },
};

type Props = { searchParams: Promise<{ page?: string; topic?: string; q?: string }> };

function href(params: { page?: number; topic?: string; q?: string }) {
	const query = new URLSearchParams();
	if (params.topic) query.set("topic", params.topic);
	if (params.q) query.set("q", params.q);
	if (params.page) query.set("page", String(params.page));
	const text = query.toString();
	return text ? `/blog?${text}` : "/blog";
}

export default async function BlogPage({ searchParams }: Props) {
	const { page: pageParam, topic, q } = await searchParams;
	const page = Math.max(0, Number.parseInt(pageParam ?? "0", 10) || 0);
	const search = q?.trim().slice(0, 100) || undefined;
	const [posts, topics] = await Promise.all([getBlogPosts({ page, topic, q: search }), getBlogTopics()]);

	return (
		<div className="min-h-screen bg-muted/50">
			<PageHero title="Health articles" description="Plain-language health guides, in Bangla" />
			<div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<form action="/blog" className="flex gap-2" role="search">
					{topic && <input type="hidden" name="topic" value={topic} />}
					<input
						type="search"
						name="q"
						defaultValue={search}
						placeholder="Search articles"
						aria-label="Search articles"
						className="h-11 w-full rounded-md border bg-background px-3 text-base"
					/>
					<button type="submit" className="h-11 rounded-md bg-primary px-5 text-primary-foreground">
						Search
					</button>
				</form>

				<nav aria-label="Topics" className="flex flex-wrap gap-2">
					<Link
						href={href({ q: search })}
						className={`rounded-full border px-3 py-1 text-sm ${!topic ? "bg-primary text-primary-foreground" : "bg-background"}`}
					>
						All
					</Link>
					{topics.map((t) => (
						<Link
							key={t.id}
							href={href({ topic: t.name, q: search })}
							className={`rounded-full border px-3 py-1 text-sm ${topic === t.name ? "bg-primary text-primary-foreground" : "bg-background"}`}
						>
							{t.displayName}
						</Link>
					))}
				</nav>

				{posts.content.length === 0 ? (
					<p className="py-12 text-center text-muted-foreground">No articles found.</p>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{posts.content.map((post) => (
							<BlogCard key={post.id} post={post} />
						))}
					</div>
				)}

				{posts.totalPages > 1 && (
					<nav aria-label="Pages" className="flex items-center justify-center gap-4 pt-2">
						{page > 0 && (
							<Link href={href({ topic, q: search, page: page - 1 })} className="underline">
								Previous
							</Link>
						)}
						<span className="text-sm text-muted-foreground">
							Page {page + 1} of {posts.totalPages}
						</span>
						{page + 1 < posts.totalPages && (
							<Link href={href({ topic, q: search, page: page + 1 })} className="underline">
								Next
							</Link>
						)}
					</nav>
				)}
			</div>
		</div>
	);
}
