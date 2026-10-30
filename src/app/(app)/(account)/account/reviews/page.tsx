"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMyReviews, removeReview } from "@/api/reviews";
import { Stars } from "@/components/reviews/Stars";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReviewStatus } from "@/types/review";

const STATUS: Record<ReviewStatus, string> = {
	PENDING: "Waiting for a moderator",
	PUBLISHED: "Published",
	REJECTED: "Not published",
	REMOVED: "Removed",
};

/** The reviews this person wrote, their state, and edit (first 7 days) or remove. */
export default function MyReviewsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["my-reviews", page], queryFn: () => fetchMyReviews(page, 20), retry: false, placeholderData: (previous) => previous });
	const remove = useMutation({
		mutationFn: (id: number) => removeReview(id),
		onSuccess: () => {
			toast.success("Review removed");
			void queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
		},
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not remove"),
	});
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="max-w-3xl space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">My reviews</CardTitle>
				</CardHeader>
				<CardContent>
					{list.isError ? (
						<Alert variant="destructive">
							<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load your reviews"}</AlertDescription>
						</Alert>
					) : list.isLoading ? (
						<Skeleton className="h-32 w-full" />
					) : rows.length === 0 ? (
						<p className="text-sm text-muted-foreground">No reviews yet. After a visit is completed, open the doctor in the directory and choose &quot;Write a review&quot;.</p>
					) : (
						<ul className="divide-y">
							{rows.map((r) => (
								<li key={r.id} className="space-y-1 py-3 text-sm">
									<p className="flex flex-wrap items-center gap-2">
										<Link href={r.doctorSlug ? `/doctors/${r.doctorSlug}` : "/doctors"} className="font-medium hover:underline">{r.doctorName ?? "Doctor"}</Link>
										<Stars value={r.overall} />
										<Badge variant={r.status === "PUBLISHED" ? "default" : "secondary"}>{STATUS[r.status]}</Badge>
									</p>
									{r.comment && <p>{r.comment}</p>}
									{r.rejectReason && <p className="text-muted-foreground">Reason: {r.rejectReason}</p>}
									<div className="flex gap-2 pt-1">
										{r.canEdit && (
											<Button asChild size="sm" variant="outline">
												<Link href={`/account/review?doctor=${r.doctorId}&edit=${r.id}`}>Change</Link>
											</Button>
										)}
										{r.status !== "REMOVED" && (
											<Button size="sm" variant="outline" disabled={remove.isPending} onClick={() => { if (window.confirm("Remove this review? You cannot write another for this doctor for 6 months.")) remove.mutate(r.id); }}>
												Remove
											</Button>
										)}
									</div>
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
		</div>
	);
}
