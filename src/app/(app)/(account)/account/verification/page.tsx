"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { fetchMyVerifications, startDoctorVerification } from "@/api/verification";
import { dateTime, VerificationStatusBadge } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Asking to be verified: a doctor for their own record, or a person claiming a facility. */
export default function VerificationPage() {
	const router = useRouter();
	const mine = useQuery({ queryKey: ["my-verifications"], queryFn: fetchMyVerifications, retry: false });
	const start = useMutation({
		mutationFn: startDoctorVerification,
		onSuccess: (created) => router.push(`/account/verification/${created.id}`),
		onError: (error) => toast.error(error instanceof Error ? error.message : "Could not start the request"),
	});

	return (
		<div className="space-y-6 p-4 md:p-8">
			<div>
				<h1 className="flex items-center gap-2 text-xl font-semibold">
					<BadgeCheck className="size-5 text-primary" aria-hidden="true" />
					Verification
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					A verified badge tells patients that Open Care has checked a doctor&apos;s registration or a facility&apos;s registration against the documents you send.
					Nothing is shown as verified until staff have reviewed it.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">I am a doctor</CardTitle>
						<CardDescription>Verify your own doctor record. It needs your BMDC registration number on your record and a copy of your registration certificate.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => start.mutate()} disabled={start.isPending}>
							{start.isPending ? "Starting..." : "Verify my doctor profile"}
						</Button>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">I represent a facility</CardTitle>
						<CardDescription>
							Open your facility&apos;s page in the directory and choose &quot;Claim this facility&quot;. You send its registration documents; once staff approve, the facility is
							verified and you are listed as its representative.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" asChild>
							<Link href="/hospitals">Find my facility</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			<section aria-label="My requests" className="space-y-3">
				<h2 className="text-base font-semibold">My requests</h2>
				{mine.isLoading && <Skeleton className="h-24 w-full" />}
				{mine.isError && (
					<Alert variant="destructive">
						<AlertDescription>{mine.error instanceof Error ? mine.error.message : "Could not load your requests"}</AlertDescription>
					</Alert>
				)}
				{mine.data && mine.data.length === 0 && <p className="text-sm text-muted-foreground">You have not asked for verification yet.</p>}
				<ul className="space-y-2">
					{(mine.data ?? []).map((c) => (
						<li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
							<div>
								<Link href={`/account/verification/${c.id}`} className="font-medium text-primary hover:underline">
									{c.subjectType === "DOCTOR" ? "Doctor profile" : "Facility"}: {c.subjectName ?? `#${c.subjectId}`}
								</Link>
								<p className="text-xs text-muted-foreground">Started {dateTime(c.createdAt)}</p>
							</div>
							<VerificationStatusBadge status={c.status} />
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}
