"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMyDoctor } from "@/api/doctors";
import { fetchDoctorReviews, fetchReviewSummary, replyToReview } from "@/api/reviews";
import { AdminHeader } from "@/components/admin/admin-header";
import { Stars } from "@/components/reviews/Stars";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

/** The reviews of the signed-in doctor. They never show who wrote them; a doctor can reply once to each. */
export default function DoctorReviewsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [draft, setDraft] = useState<Record<number, string>>({});
	const doctor = useQuery({ queryKey: ["my-doctor"], queryFn: fetchMyDoctor, retry: false });
	const doctorId = doctor.data?.id ?? null;
	const summary = useQuery({ queryKey: ["review-summary", doctorId], queryFn: () => fetchReviewSummary(doctorId as number), enabled: doctorId !== null, retry: false });
	const list = useQuery({ queryKey: ["doctor-reviews", doctorId, page], queryFn: () => fetchDoctorReviews(doctorId as number, page, 10), enabled: doctorId !== null, retry: false, placeholderData: (previous) => previous });
	const reply = useMutation({
		mutationFn: ({ id, text }: { id: number; text: string }) => replyToReview(id, text),
		onSuccess: () => {
			toast.success("Reply published");
			void queryClient.invalidateQueries({ queryKey: ["doctor-reviews"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not send your reply"),
	});
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Reviews" description="What patients wrote about you" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<Alert>
					<AlertDescription>Reviews are written by patients you saw, checked by a moderator, and shown without a name, so you cannot see who wrote one. You can reply once to each. You cannot edit or remove a review; if one breaks the rules, use &quot;Report this review&quot; on your public page.</AlertDescription>
				</Alert>
				{doctor.isError ? (
					<Alert variant="destructive">
						<AlertDescription>{doctor.error instanceof Error ? doctor.error.message : "No doctor record is linked to this account"}</AlertDescription>
					</Alert>
				) : (
					<>
						{summary.data && (
							<p className="text-sm text-muted-foreground">
								{summary.data.count} published {summary.data.count === 1 ? "review" : "reviews"}
								{summary.data.average != null ? `, average ${summary.data.average.toFixed(1)}` : `. The average appears after ${summary.data.minimumForAverage} reviews`}
							</p>
						)}
						<Card>
							<CardContent className="pt-6">
								{doctor.isLoading || list.isLoading ? (
									<Skeleton className="h-32 w-full" />
								) : rows.length === 0 ? (
									<p className="text-sm text-muted-foreground">No published reviews yet.</p>
								) : (
									<ul className="divide-y">
										{rows.map((r) => (
											<li key={r.id} className="space-y-2 py-3 text-sm">
												<p className="flex flex-wrap items-center gap-2">
													<Stars value={r.overall} />
													{r.date && <span className="text-xs text-muted-foreground">{r.date}</span>}
													{r.wouldRecommend && <span className="text-xs text-muted-foreground">· Would recommend</span>}
												</p>
												{r.comment && <p>{r.comment}</p>}
												{r.reply ? (
													<p className="rounded-md bg-muted/50 p-2"><span className="font-medium">Your reply:</span> {r.reply.text}</p>
												) : (
													<div className="space-y-2">
														<Textarea value={draft[r.id] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [r.id]: e.target.value }))} maxLength={500} rows={2} placeholder="Reply publicly (once). Be polite and do not mention the patient's health." />
														<Button size="sm" disabled={reply.isPending || !(draft[r.id] ?? "").trim()} onClick={() => reply.mutate({ id: r.id, text: draft[r.id] })}>Publish reply</Button>
													</div>
												)}
											</li>
										))}
									</ul>
								)}
								{totalPages > 1 && (
									<div className="mt-4 flex items-center justify-between text-sm">
										<Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Newer</Button>
										<span className="text-muted-foreground">Page {page} of {totalPages}</span>
										<Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Older</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}
