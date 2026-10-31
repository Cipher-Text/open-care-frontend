import { getLocale, getTranslations } from "next-intl/server";
import { baseUrl } from "@/config/config";
import type { PublicReview, ReviewSummary } from "@/types/review";
import { ReportReview } from "@/components/reviews/ReportReview";
import { formatDate } from "@/lib/format";
import { Stars } from "@/components/reviews/Stars";

async function get<T>(path: string): Promise<T | null> {
	try {
		const response = await fetch(`${baseUrl}${path}`, { headers: { Accept: "application/json" }, next: { revalidate: 600 } });
		return response.ok ? ((await response.json()) as T) : null;
	} catch {
		return null;
	}
}

/** `label` is a key of reviews.* in the message files. */
const DIMENSIONS: { key: keyof PublicReview; label: string }[] = [
	{ key: "scoreExplanation", label: "explanation" },
	{ key: "scoreTime", label: "time" },
	{ key: "scoreListening", label: "listening" },
	{ key: "scoreBehaviour", label: "behaviour" },
];

/**
 * A doctor's published reviews. Reviews are written only by patients who were seen, checked by a moderator, shown
 * without a name, and cannot be bought or hidden. The average appears from five reviews.
 */
export async function DoctorReviews({ doctorId }: { doctorId: number }) {
	const t = await getTranslations("reviews");
	const locale = await getLocale();
	const stars = (value: number) => t("outOfFive", { count: Math.max(0, Math.min(5, Math.round(value))) });
	const [summary, page] = await Promise.all([
		get<ReviewSummary>(`/doctors/${doctorId}/reviews/summary`),
		get<{ content?: PublicReview[] }>(`/doctors/${doctorId}/reviews?page=0&size=10`),
	]);
	const reviews = page?.content ?? [];
	const total = summary?.count ?? 0;
	const max = Math.max(1, ...(summary?.distribution ?? [0]));

	return (
		<section aria-labelledby="reviews-heading" className="space-y-4 rounded-lg border p-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h2 id="reviews-heading" className="text-lg font-semibold">
					{total > 0 ? t("headingCount", { count: total }) : t("heading")}
				</h2>
				{/* The review form is a signed-in screen outside the language scheme, so a plain link */}
				<a href={`/account/review?doctor=${doctorId}`} className="text-sm font-medium text-primary hover:underline">
					{t("write")}
				</a>
			</div>

			{total === 0 ? (
				<p className="text-sm text-muted-foreground">{t("none")}</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
					<div className="space-y-1">
						{summary?.average != null ? (
							<>
								<p className="text-3xl font-semibold tabular-nums">{summary.average.toFixed(1)}</p>
								<Stars value={summary.average} label={stars(summary.average)} />
								{summary.recommendPercent != null && <p className="text-sm text-muted-foreground">{t("recommend", { percent: summary.recommendPercent })}</p>}
							</>
						) : (
							<p className="text-sm text-muted-foreground">{t("averageAfter", { count: summary?.minimumForAverage ?? 5 })}</p>
						)}
					</div>
					<ul className="space-y-1" aria-label={t("byStars")}>
						{[5, 4, 3, 2, 1].map((star) => {
							const count = summary?.distribution?.[star - 1] ?? 0;
							return (
								<li key={star} className="flex items-center gap-2 text-xs">
									<span className="w-14 shrink-0">{t("stars", { stars: star })}</span>
									<span className="h-2 flex-1 overflow-hidden rounded bg-muted">
										<span className="block h-full bg-amber-500" style={{ width: `${(count / max) * 100}%` }} />
									</span>
									<span className="w-6 text-right tabular-nums">{count}</span>
								</li>
							);
						})}
					</ul>
				</div>
			)}

			{reviews.length > 0 && (
				<ul className="divide-y">
					{reviews.map((r) => (
						<li key={r.id} className="space-y-1 py-3 text-sm">
							<p className="flex flex-wrap items-center gap-2">
								<Stars value={r.overall} label={stars(r.overall)} />
								<span className="font-medium">{t("verifiedPatient")}</span>
								{r.date && <span className="text-xs text-muted-foreground">{formatDate(r.date, locale) ?? r.date}</span>}
								{r.wouldRecommend && <span className="text-xs text-muted-foreground">· {t("wouldRecommend")}</span>}
							</p>
							{r.comment && <p>{r.comment}</p>}
							<p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
								{DIMENSIONS.map((d) => (r[d.key] != null ? <span key={d.key}>{t("score", { label: t(d.label), score: Number(r[d.key]) })}</span> : null))}
							</p>
							{r.reply && (
								<p className="rounded-md bg-muted/50 p-2 text-sm">
									<span className="font-medium">{r.reply.date ? t("replyDated", { date: formatDate(r.reply.date, locale) ?? r.reply.date }) : t("reply")}</span> {r.reply.text}
								</p>
							)}
							<ReportReview reviewId={r.id} />
						</li>
					))}
				</ul>
			)}
			<p className="text-xs text-muted-foreground">{t("footer")}</p>
		</section>
	);
}
