import NextLink from "next/link";
import { baseUrl } from "@/config/config";
import type { PublicReview, ReviewSummary } from "@/types/review";
import { ReportReview } from "@/components/reviews/ReportReview";
import { Stars } from "@/components/reviews/Stars";

async function get<T>(path: string): Promise<T | null> {
	try {
		const response = await fetch(`${baseUrl}${path}`, { headers: { Accept: "application/json" }, next: { revalidate: 600 } });
		return response.ok ? ((await response.json()) as T) : null;
	} catch {
		return null;
	}
}

const DIMENSIONS: { key: keyof PublicReview; label: string }[] = [
	{ key: "scoreExplanation", label: "Explained clearly" },
	{ key: "scoreTime", label: "Time for the patient" },
	{ key: "scoreListening", label: "Listened carefully" },
	{ key: "scoreBehaviour", label: "Friendly behaviour" },
];

/**
 * A doctor's published reviews. Reviews are written only by patients who were seen, checked by a moderator, shown
 * without a name, and cannot be bought or hidden. The average appears from five reviews.
 */
export async function DoctorReviews({ doctorId }: { doctorId: number }) {
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
					Patient reviews {total > 0 ? `(${total})` : ""}
				</h2>
				<NextLink href={`/account/review?doctor=${doctorId}`} className="text-sm font-medium text-primary hover:underline">
					Write a review
				</NextLink>
			</div>

			{total === 0 ? (
				<p className="text-sm text-muted-foreground">No reviews yet. Only patients who were seen by this doctor can write one.</p>
			) : (
				<div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
					<div className="space-y-1">
						{summary?.average != null ? (
							<>
								<p className="text-3xl font-semibold tabular-nums">{summary.average.toFixed(1)}</p>
								<Stars value={summary.average} />
								{summary.recommendPercent != null && <p className="text-sm text-muted-foreground">{summary.recommendPercent}% would recommend</p>}
							</>
						) : (
							<p className="text-sm text-muted-foreground">The average appears after {summary?.minimumForAverage ?? 5} reviews.</p>
						)}
					</div>
					<ul className="space-y-1" aria-label="Reviews by stars">
						{[5, 4, 3, 2, 1].map((stars) => {
							const count = summary?.distribution?.[stars - 1] ?? 0;
							return (
								<li key={stars} className="flex items-center gap-2 text-xs">
									<span className="w-10 shrink-0">{stars} stars</span>
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
								<Stars value={r.overall} />
								<span className="font-medium">Verified patient</span>
								{r.date && <span className="text-xs text-muted-foreground">{r.date}</span>}
								{r.wouldRecommend && <span className="text-xs text-muted-foreground">· Would recommend</span>}
							</p>
							{r.comment && <p>{r.comment}</p>}
							<p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
								{DIMENSIONS.map((d) => (r[d.key] != null ? <span key={d.key}>{d.label}: {String(r[d.key])}/5</span> : null))}
							</p>
							{r.reply && (
								<p className="rounded-md bg-muted/50 p-2 text-sm">
									<span className="font-medium">Reply from the doctor{r.reply.date ? `, ${r.reply.date}` : ""}:</span> {r.reply.text}
								</p>
							)}
							<ReportReview reviewId={r.id} />
						</li>
					))}
				</ul>
			)}
			<p className="text-xs text-muted-foreground">
				Reviews are written by patients who were seen by this doctor, checked before they appear, and shown without a name. Open Care does not sell or remove reviews.
			</p>
		</section>
	);
}
