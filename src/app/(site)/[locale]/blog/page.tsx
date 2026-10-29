import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BlogCard from "@/components/blog/BlogCard";
import PageHero from "@/components/common/PageHero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { bilingual } from "@/i18n/seo";
import { getBlogPosts, getBlogTopics } from "@/lib/public-blog";

export const revalidate = 600;

type Props = {
	params: Promise<{ locale: Locale }>;
	searchParams: Promise<{ page?: string; topic?: string; q?: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "blog" });
	return { title: `${t("title")} | Open Care`, description: t("metaDescription"), ...bilingual(locale, "/blog") };
}

function href(params: { page?: number; topic?: string; q?: string }) {
	const query = new URLSearchParams();
	if (params.topic) query.set("topic", params.topic);
	if (params.q) query.set("q", params.q);
	if (params.page) query.set("page", String(params.page));
	const text = query.toString();
	return text ? `/blog?${text}` : "/blog";
}

export default async function BlogPage({ params, searchParams }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("blog");
	const { page: pageParam, topic, q } = await searchParams;
	const page = Math.max(0, Number.parseInt(pageParam ?? "0", 10) || 0);
	const search = q?.trim().slice(0, 100) || undefined;
	const [posts, topics] = await Promise.all([getBlogPosts({ page, topic, q: search }), getBlogTopics()]);

	return (
		<div className="min-h-screen bg-muted/50">
			<PageHero title={t("heroTitle")} description={t("heroDescription")} />
			<div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
				<form action="/blog" className="flex gap-2" role="search">
					{topic && <input type="hidden" name="topic" value={topic} />}
					<input
						type="search"
						name="q"
						defaultValue={search}
						placeholder={t("search")}
						aria-label={t("search")}
						className="h-11 w-full rounded-md border bg-background px-3 text-base"
					/>
					<button type="submit" className="h-11 rounded-md bg-primary px-5 text-primary-foreground">
						{t("searchButton")}
					</button>
				</form>

				<nav aria-label={t("topics")} className="flex flex-wrap gap-2">
					<Link
						href={href({ q: search })}
						className={`rounded-full border px-3 py-1 text-sm ${!topic ? "bg-primary text-primary-foreground" : "bg-background"}`}
					>
						{t("all")}
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
					<p className="py-12 text-center text-muted-foreground">{t("none")}</p>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{posts.content.map((post) => (
							<BlogCard key={post.id} post={post} />
						))}
					</div>
				)}

				{posts.totalPages > 1 && (
					<nav aria-label={t("pages")} className="flex items-center justify-center gap-4 pt-2">
						{page > 0 && (
							<Link href={href({ topic, q: search, page: page - 1 })} className="underline">
								{t("previous")}
							</Link>
						)}
						<span className="text-sm text-muted-foreground">
							{t("pageOf", { page: page + 1, total: posts.totalPages })}
						</span>
						{page + 1 < posts.totalPages && (
							<Link href={href({ topic, q: search, page: page + 1 })} className="underline">
								{t("next")}
							</Link>
						)}
					</nav>
				)}
			</div>
		</div>
	);
}
