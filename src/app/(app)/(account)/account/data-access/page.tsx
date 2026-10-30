"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyDataAccess, type DataAccessKind } from "@/api/data-access";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const KIND: Record<DataAccessKind, string> = {
	HEALTH_VITALS: "your health readings",
	PRESCRIPTION: "a prescription",
	PROFILE: "your profile details",
	// these two are about lists and files, not about one person, so they never appear here
	DONOR_LIST: "the blood donor list",
	PRIVATE_FILE: "a private file",
};

/** Who opened this person's sensitive data. Using your own data is never listed. */
export default function MyDataAccessPage() {
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["my-data-access", page], queryFn: () => fetchMyDataAccess(page, 20), retry: false, placeholderData: (previous) => previous });
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="max-w-3xl space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Who looked at my data</CardTitle>
					<CardDescription>
						Each time a doctor opens one of your prescriptions, or Open Care staff open your profile or health readings, it is recorded here. Staff are shown only as &quot;Open Care staff&quot;. Your own use is not listed. If something looks wrong, write to the address on the contact page.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{list.isError ? (
						<Alert variant="destructive">
							<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load the access log"}</AlertDescription>
						</Alert>
					) : list.isLoading ? (
						<Skeleton className="h-32 w-full" />
					) : rows.length === 0 ? (
						<p className="text-sm text-muted-foreground">Nobody else has opened your data.</p>
					) : (
						<ul className="divide-y">
							{rows.map((r) => (
								<li key={r.id} className="py-3 text-sm">
									<p>
										<strong>{r.actorLabel}</strong> opened {KIND[r.kind] ?? "your data"}
										{r.detail ? <span className="text-muted-foreground"> ({r.detail})</span> : null}
									</p>
									<p className="text-xs text-muted-foreground">{dateTime(r.date)}</p>
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
