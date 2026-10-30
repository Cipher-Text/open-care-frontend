"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchEnquiries, markEnquiryHandled } from "@/api/enquiries";
import { AdminHeader } from "@/components/admin/admin-header";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 20;

/** Questions people sent to the facilities this person represents. */
export default function EnquiriesPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["enquiries", page], queryFn: () => fetchEnquiries(page, PAGE_SIZE), retry: false, placeholderData: (previous) => previous });
	const handled = useMutation({
		mutationFn: (id: number) => markEnquiryHandled(id),
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["enquiries"] }),
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not mark it handled"),
	});

	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Enquiries" description="Questions people sent to your facilities">
				<Button asChild variant="outline" size="sm">
					<Link href="/admin/my-figures">My page figures</Link>
				</Button>
			</AdminHeader>
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<Card>
					<CardContent className="pt-6">
						{list.isError ? (
							<Alert variant="destructive">
								<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the enquiries"}</AlertDescription>
							</Alert>
						) : list.isLoading ? (
							<Skeleton className="h-32 w-full" />
						) : rows.length === 0 ? (
							<p className="text-sm text-muted-foreground">No enquiries yet. They appear here once a signed-in person asks one of your verified facilities a question.</p>
						) : (
							<ul className="divide-y">
								{rows.map((e) => (
									<li key={e.id} className="space-y-1 py-3 text-sm">
										<div className="flex flex-wrap items-center justify-between gap-2">
											<p className="font-medium">
												{e.fromName ?? "A patient"} · {e.hospitalName ?? `Facility #${e.hospitalId}`}
												{e.status === "NEW" && <Badge className="ml-2">New</Badge>}
											</p>
											<span className="text-xs text-muted-foreground">{dateTime(e.createdAt)}</span>
										</div>
										{e.testName && <p className="text-muted-foreground">About: {e.testName}</p>}
										<p>{e.message}</p>
										<div className="flex flex-wrap items-center gap-3">
											<a href={`tel:${e.contactPhone}`} className="font-medium text-primary hover:underline">
												{e.contactPhone}
											</a>
											{e.status === "NEW" && (
												<Button size="sm" variant="outline" disabled={handled.isPending} onClick={() => handled.mutate(e.id)}>
													Mark handled
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
		</div>
	);
}
