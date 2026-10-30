"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { decideReview, dismissReports, fetchModerationQueue } from "@/api/reviews";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Stars } from "@/components/reviews/Stars";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";

/** Reviews waiting to be checked, and published reviews that were reported. */
export default function ReviewModerationPage() {
	const queryClient = useQueryClient();
	const [reported, setReported] = useState(false);
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["review-moderation", reported, page], queryFn: () => fetchModerationQueue(reported, page, 20), retry: false, placeholderData: (previous) => previous });
	const done = (message: string) => () => {
		toast.success(message);
		void queryClient.invalidateQueries({ queryKey: ["review-moderation"] });
	};
	const failed = (error: unknown) => toast.error(error instanceof Error ? error.message : "That did not work");
	const publish = useMutation({ mutationFn: (id: number) => decideReview(id, "PUBLISHED"), onSuccess: done("Published"), onError: failed });
	const reject = useMutation({ mutationFn: ({ id, reason }: { id: number; reason: string }) => decideReview(id, "REJECTED", reason), onSuccess: done("Rejected. The patient is told why."), onError: failed });
	const takeDown = useMutation({ mutationFn: ({ id, reason }: { id: number; reason: string }) => decideReview(id, "REMOVED", reason), onSuccess: done("Removed"), onError: failed });
	const dismiss = useMutation({ mutationFn: (id: number) => dismissReports(id), onSuccess: done("Reports dismissed"), onError: failed });
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;
	const busy = publish.isPending || reject.isPending || takeDown.isPending || dismiss.isPending;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Review moderation" description="Check reviews before they appear, and handle reports" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<div className="w-full sm:w-64">
					<NativeSelect aria-label="Queue" value={reported ? "reported" : "waiting"} onChange={(e) => { setReported(e.target.value === "reported"); setPage(1); }}>
						<option value="waiting">Waiting to be checked</option>
						<option value="reported">Published but reported</option>
					</NativeSelect>
				</div>
				<Card>
					<CardContent className="pt-6">
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the queue"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-32 w-full" />
						) : rows.length === 0 ? (
							<p className="text-sm text-muted-foreground">Nothing to check.</p>
						) : (
							<ul className="divide-y">
								{rows.map((r) => (
									<li key={r.id} className="space-y-2 py-4 text-sm">
										<div className="flex flex-wrap items-center justify-between gap-2">
											<p className="flex flex-wrap items-center gap-2">
												<Stars value={r.overall} />
												<span className="font-medium">{r.doctorName ?? `Doctor #${r.doctorId}`}</span>
												<span className="text-muted-foreground">by {r.reviewerName ?? "a patient"}</span>
												<Badge variant="secondary">{r.evidence === "APPOINTMENT" ? "Completed visit" : "Prescription"}</Badge>
											</p>
											<span className="text-xs text-muted-foreground">{dateTime(r.createdAt)}</span>
										</div>
										{r.autoFlags && <Alert variant="destructive"><AlertDescription>The automatic check found: {r.autoFlags}</AlertDescription></Alert>}
										<p>{r.comment ?? <span className="text-muted-foreground">No comment, stars only.</span>}</p>
										{r.reports.length > 0 && (
											<ul className="rounded-md bg-muted/50 p-2 text-xs">
												{r.reports.map((p, i) => (
													<li key={i}>Report: {p.reason.toLowerCase().replace("_", " ")}{p.note ? ` — ${p.note}` : ""} ({dateTime(p.date)})</li>
												))}
											</ul>
										)}
										<div className="flex flex-wrap gap-2">
											{!reported && (
												<>
													<Button size="sm" disabled={busy} onClick={() => publish.mutate(r.id)}>Publish</Button>
													<Button size="sm" variant="outline" disabled={busy} onClick={() => { const reason = window.prompt("Why is it not published? The patient sees this."); if (reason && reason.trim()) reject.mutate({ id: r.id, reason }); }}>Reject</Button>
												</>
											)}
											{reported && (
												<>
													<Button size="sm" variant="outline" disabled={busy} onClick={() => dismiss.mutate(r.id)}>Keep it, dismiss the reports</Button>
													<Button size="sm" variant="outline" disabled={busy} onClick={() => { const reason = window.prompt("Why is it removed?"); if (reason && reason.trim()) takeDown.mutate({ id: r.id, reason }); }}>Remove it</Button>
												</>
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
		</div>
	);
}
