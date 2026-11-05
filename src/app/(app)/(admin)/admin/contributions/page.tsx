"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchContributionQueue } from "@/api/contributions";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KIND_WORDS, STATUS_WORDS } from "@/lib/contribution-kind";
import { qk } from "@/lib/query-keys";
import type { ContributionKind, ContributionStatus } from "@/types/contribution";

const PAGE_SIZE = 20;

/** Doctors, nurses, facilities and ambulances that people propose. Waiting ones first, oldest first. */
export default function ContributionQueuePage() {
	const [kind, setKind] = useState<ContributionKind | "">("");
	const [status, setStatus] = useState<ContributionStatus | "">("PENDING");
	const [page, setPage] = useState(1);
	const queue = useQuery({
		queryKey: [...qk.contributionQueue, kind, status, page],
		queryFn: () => fetchContributionQueue({ page, size: PAGE_SIZE, kind, status }),
		placeholderData: (previous) => previous,
	});

	return (
		<div className="flex flex-col">
			<AdminHeader title="Contributions" description="Review what people propose to add" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<div className="flex flex-wrap gap-2">
					<div className="w-full sm:w-44">
						<NativeSelect aria-label="Kind" value={kind} onChange={(e) => { setKind(e.target.value as ContributionKind | ""); setPage(1); }}>
							<option value="">All kinds</option>
							{(Object.keys(KIND_WORDS) as ContributionKind[]).map((k) => <option key={k} value={k}>{KIND_WORDS[k].label}</option>)}
						</NativeSelect>
					</div>
					<div className="w-full sm:w-52">
						<NativeSelect aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value as ContributionStatus | ""); setPage(1); }}>
							{(Object.keys(STATUS_WORDS) as ContributionStatus[]).map((s) => <option key={s} value={s}>{STATUS_WORDS[s]}</option>)}
						</NativeSelect>
					</div>
				</div>
				<Card>
					<CardContent className="pt-6">
						{queue.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{queue.error instanceof Error ? queue.error.message : "Could not load the proposals"}</AlertDescription>
							</Alert>
						) : queue.isLoading ? (
							<Skeleton className="h-40 w-full" />
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Kind</TableHead>
										<TableHead>Sent</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(queue.data?.content ?? []).map((c) => (
										<TableRow key={c.id}>
											<TableCell className="font-medium">
												<Link href={`/admin/contributions/${c.id}`} className="hover:underline">{c.subjectName ?? `#${c.id}`}</Link>
											</TableCell>
											<TableCell>{KIND_WORDS[c.kind].label}</TableCell>
											<TableCell className="whitespace-nowrap">{dateTime(c.submittedAt)}</TableCell>
											<TableCell><Badge variant={c.status === "APPROVED" ? "default" : c.status === "REJECTED" ? "destructive" : "secondary"}>{STATUS_WORDS[c.status]}</Badge></TableCell>
										</TableRow>
									))}
									{(queue.data?.content ?? []).length === 0 && (
										<TableRow>
											<TableCell colSpan={4} className="text-center text-muted-foreground">Nothing in this list.</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
						{queue.data && queue.data.totalPages > 1 && (
							<div className="flex items-center justify-end gap-3 pt-4 text-sm">
								<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
								<span>Page {queue.data.currentPage} of {queue.data.totalPages}</span>
								<Button variant="outline" size="sm" disabled={page >= queue.data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
