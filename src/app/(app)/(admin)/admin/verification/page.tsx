"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVerificationQueue, fetchVerificationStats } from "@/api/verification";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime, VerificationStatusBadge } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { VerificationStatus, VerificationSubject } from "@/types/verification";

const PAGE_SIZE = 20;

/** Doctor and facility verification requests. Oldest submitted first; a draft is not shown until the person submits it. */
export default function VerificationQueuePage() {
	const [type, setType] = useState<VerificationSubject | "">("");
	const [status, setStatus] = useState<VerificationStatus | "">("PENDING");
	const [page, setPage] = useState(1);
	const queue = useQuery({ queryKey: ["verification-queue", type, status, page], queryFn: () => fetchVerificationQueue({ page, size: PAGE_SIZE, type, status }), placeholderData: (previous) => previous });
	const stats = useQuery({ queryKey: ["verification-stats"], queryFn: fetchVerificationStats, retry: false });

	const waiting = (stats.data?.counts ?? []).filter((c) => c.status === "PENDING" || c.status === "UNDER_REVIEW").reduce((sum, c) => sum + c.total, 0);

	return (
		<div className="flex flex-col">
			<AdminHeader title="Verification" description="Review doctor and facility requests" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				{stats.data && (
					<p className="text-sm text-muted-foreground">
						{waiting} waiting or being reviewed
						{stats.data.medianDaysToDecision != null ? `. Decisions took ${stats.data.medianDaysToDecision} days (median) over ${stats.data.decided} decided.` : "."}
					</p>
				)}
				<div className="flex flex-wrap gap-2">
					<div className="w-full sm:w-44">
						<NativeSelect aria-label="Kind" value={type} onChange={(e) => { setType(e.target.value as VerificationSubject | ""); setPage(1); }}>
							<option value="">All kinds</option>
							<option value="DOCTOR">Doctors</option>
							<option value="HOSPITAL">Facilities</option>
						</NativeSelect>
					</div>
					<div className="w-full sm:w-52">
						<NativeSelect aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value as VerificationStatus | ""); setPage(1); }}>
							<option value="">All statuses</option>
							<option value="PENDING">Waiting for review</option>
							<option value="UNDER_REVIEW">Being reviewed</option>
							<option value="VERIFIED">Verified</option>
							<option value="REJECTED">Not approved</option>
							<option value="REVOKED">Withdrawn verification</option>
							<option value="WITHDRAWN">Withdrawn by the person</option>
						</NativeSelect>
					</div>
				</div>
				<Card>
					<CardContent className="pt-6">
						{queue.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{queue.error instanceof Error ? queue.error.message : "Could not load the queue"}</AlertDescription>
							</Alert>
						) : queue.isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Who</TableHead>
										<TableHead>Kind</TableHead>
										<TableHead>Registration no.</TableHead>
										<TableHead>Submitted</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(queue.data?.content ?? []).map((c) => (
										<TableRow key={c.id}>
											<TableCell className="font-medium">
												<Link href={`/admin/verification/${c.id}`} className="hover:underline">
													{c.subjectName ?? `#${c.subjectId}`}
												</Link>
											</TableCell>
											<TableCell>{c.subjectType === "DOCTOR" ? "Doctor" : "Facility"}</TableCell>
											<TableCell>{c.claimedRegistrationNo ?? "-"}</TableCell>
											<TableCell className="whitespace-nowrap">{dateTime(c.submittedAt)}</TableCell>
											<TableCell>
												<VerificationStatusBadge status={c.status} />
											</TableCell>
										</TableRow>
									))}
									{(queue.data?.content ?? []).length === 0 && (
										<TableRow>
											<TableCell colSpan={5} className="text-center text-muted-foreground">
												Nothing in this list.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
						{queue.data && queue.data.totalPages > 1 && (
							<div className="flex items-center justify-end gap-3 pt-4 text-sm">
								<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
									Previous
								</Button>
								<span>
									Page {queue.data.currentPage} of {queue.data.totalPages}
								</span>
								<Button variant="outline" size="sm" disabled={page >= queue.data.totalPages} onClick={() => setPage(page + 1)}>
									Next
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
