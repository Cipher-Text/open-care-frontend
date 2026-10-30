"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
	approveVerification,
	fetchDocumentLink,
	fetchVerificationDetail,
	rejectVerification,
	revokeVerification,
	startVerificationReview,
} from "@/api/verification";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime, VerificationStatusBadge } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

/** One request: its documents, the history, and the decision. Opening a document is recorded in the history. */
export default function VerificationReviewPage() {
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const [text, setText] = useState("");
	const { data, isLoading, isError, error } = useQuery({ queryKey: ["verification-detail", id], queryFn: () => fetchVerificationDetail(id), retry: false });

	const refresh = () => {
		queryClient.invalidateQueries({ queryKey: ["verification-detail", id] });
		queryClient.invalidateQueries({ queryKey: ["verification-queue"] });
		queryClient.invalidateQueries({ queryKey: ["verification-stats"] });
	};
	const failed = (e: unknown) => toast.error(e instanceof Error ? e.message : "Something went wrong");
	const done = (message: string) => () => { toast.success(message); setText(""); refresh(); };
	const review = useMutation({ mutationFn: () => startVerificationReview(id), onSuccess: done("Marked as being reviewed by you"), onError: failed });
	const approve = useMutation({ mutationFn: () => approveVerification(id, text.trim() || undefined), onSuccess: done("Approved"), onError: failed });
	const reject = useMutation({ mutationFn: () => rejectVerification(id, text.trim()), onSuccess: done("Not approved: the person will see the reason"), onError: failed });
	const revoke = useMutation({ mutationFn: () => revokeVerification(id, text.trim()), onSuccess: done("Verification withdrawn"), onError: failed });

	const openDocument = async (documentId: number) => {
		try {
			const { url } = await fetchDocumentLink(id, documentId);
			window.open(url, "_blank", "noopener,noreferrer");
			refresh();
		} catch (e) {
			failed(e);
		}
	};

	const open = data?.status === "PENDING" || data?.status === "UNDER_REVIEW";
	const busy = review.isPending || approve.isPending || reject.isPending || revoke.isPending;
	const publicPath = data?.subjectSlug ? (data.subjectType === "DOCTOR" ? `/doctors/${data.subjectSlug}` : `/hospitals/${data.subjectSlug}`) : null;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Verification request" description={data ? `${data.subjectType === "DOCTOR" ? "Doctor" : "Facility"}: ${data.subjectName ?? data.subjectId}` : undefined}>
				<Button variant="outline" asChild>
					<Link href="/admin/verification">
						<ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
						Queue
					</Link>
				</Button>
			</AdminHeader>
			<div className="mx-auto w-full max-w-4xl space-y-4 p-4 md:p-8">
				{isLoading && <Skeleton className="h-64 w-full" />}
				{isError && (
					<Alert variant="destructive">
						<AlertDescription>{error instanceof Error ? error.message : "Could not load the request"}</AlertDescription>
					</Alert>
				)}
				{data && (
					<>
						<Card>
							<CardHeader>
								<CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
									<span>{data.subjectName ?? `#${data.subjectId}`}</span>
									<VerificationStatusBadge status={data.status} />
								</CardTitle>
								<CardDescription>
									Asked by {data.requestedByName ?? "staff"} on {dateTime(data.createdAt)}, submitted {dateTime(data.submittedAt)}.
									{data.reviewer ? ` Reviewer: ${data.reviewer}.` : ""}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<p>
									<span className="font-medium">{data.subjectType === "DOCTOR" ? "BMDC number" : "Registration number"} on the record: </span>
									{data.claimedRegistrationNo ?? "none"}
								</p>
								{data.note && (
									<p>
										<span className="font-medium">Note from the person: </span>
										{data.note}
									</p>
								)}
								{data.decisionReason && (
									<p>
										<span className="font-medium">Decision note: </span>
										{data.decisionReason}
									</p>
								)}
								{publicPath && (
									<Link href={publicPath} target="_blank" className="inline-flex items-center gap-1 text-primary hover:underline">
										Open the public page <ExternalLink className="size-3.5" aria-hidden="true" />
									</Link>
								)}
								<div>
									<p className="mb-1 font-medium">Documents ({data.documents.length})</p>
									<ul className="space-y-1">
										{data.documents.map((d, index) => (
											<li key={d.id}>
												<Button variant="outline" size="sm" onClick={() => openDocument(d.id)}>
													Open document {index + 1}
												</Button>
												<span className="ml-2 text-xs text-muted-foreground">added {dateTime(d.uploadedAt)}. The link lasts 5 minutes and the opening is recorded.</span>
											</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>

						{(open || data.status === "VERIFIED") && (
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Decision</CardTitle>
									<CardDescription>
										Check the registration number against the BMDC register (doctors) or the facility&apos;s registration, and that the documents match the record. A reason is
										required to reject or withdraw; the person sees it.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="space-y-1">
										<Label htmlFor="decision-note">Note or reason</Label>
										<Textarea id="decision-note" value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} rows={3} />
									</div>
									<div className="flex flex-wrap gap-2">
										{data.status === "PENDING" && (
											<Button variant="outline" onClick={() => review.mutate()} disabled={busy}>
												Start reviewing
											</Button>
										)}
										{open && (
											<>
												<Button onClick={() => approve.mutate()} disabled={busy}>
													Approve
												</Button>
												<Button variant="destructive" onClick={() => reject.mutate()} disabled={busy || !text.trim()}>
													Reject
												</Button>
											</>
										)}
										{data.status === "VERIFIED" && (
											<Button variant="destructive" onClick={() => revoke.mutate()} disabled={busy || !text.trim()}>
												Withdraw the verification
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						<Card>
							<CardHeader>
								<CardTitle className="text-base">History</CardTitle>
								<CardDescription>Every step is kept: who did it, when, and the note.</CardDescription>
							</CardHeader>
							<CardContent>
								<ol className="space-y-2 text-sm">
									{(data.events ?? []).map((e, index) => (
										<li key={index} className="rounded-md border p-2">
											<span className="font-medium">{e.type.replace(/_/g, " ").toLowerCase()}</span>
											{e.fromStatus && e.toStatus && e.fromStatus !== e.toStatus ? ` (${e.fromStatus} to ${e.toStatus})` : ""}
											<span className="text-muted-foreground"> by {e.actor ?? "unknown"}, {dateTime(e.at)}</span>
											{e.note && <p className="mt-1">{e.note}</p>}
										</li>
									))}
								</ol>
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}
