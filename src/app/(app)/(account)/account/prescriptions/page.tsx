"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyPrescriptions } from "@/api/prescriptions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 20;
const date = (value: string) => new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** The prescriptions doctors wrote for the signed-in person. */
export default function MyPrescriptionsPage() {
	const [page, setPage] = useState(1);
	const list = useQuery({ queryKey: ["my-prescriptions", page], queryFn: () => fetchMyPrescriptions(page, PAGE_SIZE), retry: false, placeholderData: (previous) => previous });
	const rows = list.data?.content ?? [];
	const totalPages = list.data?.totalPages ?? 0;

	return (
		<div className="max-w-3xl space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">My prescriptions</CardTitle>
					<CardDescription>
						Prescriptions your doctors wrote for your profile, after you approved them. Open one to read it or print it. Only you and the doctor who wrote it can read a prescription; who opens it is recorded under{" "}
						<Link href="/account/data-access" className="underline">Who looked</Link>.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{list.isError ? (
						<Alert variant="destructive">
							<AlertDescription>{list.error instanceof Error ? list.error.message : "Could not load your prescriptions"}</AlertDescription>
						</Alert>
					) : list.isLoading ? (
						<Skeleton className="h-32 w-full" />
					) : rows.length === 0 ? (
						<p className="text-sm text-muted-foreground">No prescriptions yet. When a doctor writes one for you, it appears here.</p>
					) : (
						<ul className="divide-y">
							{rows.map((p) => (
								<li key={p.id} className="flex flex-wrap items-start justify-between gap-3 py-3 text-sm">
									<div className="space-y-1">
										<p className="font-medium">
											{p.doctorName ?? "Doctor"} <span className="font-normal text-muted-foreground">· {date(p.prescriptionDate)}</span>
											{p.replaced && <Badge variant="secondary" className="ml-2">Replaced by a corrected copy</Badge>}
										</p>
										<p>{p.diagnosis}</p>
										<p className="text-xs text-muted-foreground">
											{p.prescriptionNo} · {p.medicineCount} {p.medicineCount === 1 ? "medicine" : "medicines"}
											{p.hospitalName ? ` · ${p.hospitalName}` : ""}
										</p>
									</div>
									<Button asChild size="sm" variant="outline">
										<Link href={`/account/prescriptions/${p.id}`}>Open</Link>
									</Button>
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
