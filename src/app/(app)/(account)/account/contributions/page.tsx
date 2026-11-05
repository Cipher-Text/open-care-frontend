"use client";

import { levelLabel } from "@/lib/level-labels";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchContributionSummary, fetchDoctorContributionSummary, fetchMyContributions, withdrawContribution } from "@/api/contributions";
import { dateTime } from "@/components/verification/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KIND_WORDS, STATUS_WORDS } from "@/lib/contribution-kind";
import { qk } from "@/lib/query-keys";

/** The person's score and badge, and every proposal they sent with how staff decided. */
export default function MyContributionsPage() {
	const queryClient = useQueryClient();
	const summary = useQuery({ queryKey: [...qk.contributionSummary], queryFn: fetchContributionSummary });
	const doctorScore = useQuery({ queryKey: [...qk.doctorContributionSummary], queryFn: fetchDoctorContributionSummary, retry: false });
	const mine = useQuery({ queryKey: [...qk.myContributions], queryFn: fetchMyContributions });
	const withdraw = useMutation({
		mutationFn: (id: number) => withdrawContribution(id),
		onSuccess: () => {
			toast.success("Withdrawn");
			queryClient.invalidateQueries({ queryKey: [...qk.myContributions] });
			queryClient.invalidateQueries({ queryKey: [...qk.contributionSummary] });
			queryClient.invalidateQueries({ queryKey: [...qk.doctorContributionSummary] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not withdraw"),
	});

	const s = summary.data;
	return (
		<div className="space-y-6 p-4 md:p-8">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold">Help build the directory</h1>
					<p className="text-muted-foreground">Add a doctor, nurse, hospital or ambulance that is missing. When staff accept it, you earn points and badges.</p>
				</div>
				<Button asChild>
					<Link href="/account/contribute">Add information</Link>
				</Button>
			</div>

			{summary.isLoading ? (
				<Skeleton className="h-28 w-full" />
			) : s ? (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-lg">
							<span aria-hidden="true" className="text-3xl">🌱</span>
							<span>{s.level > 0 ? levelLabel("contributor", s.level) : "No level yet"}</span>
							<Badge variant="secondary">{s.points} points</Badge>
						</CardTitle>
						<CardDescription>
							{s.level === 0 ? "Your first accepted contribution starts your level." : s.pointsToNextLevel == null ? "You are at the top level." : ""}
							{s.pointsToNextLevel != null ? `${s.pointsToNextLevel} more points to level ${s.level + 1}.` : ""}
						</CardDescription>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						{s.approved} accepted, {s.pending} waiting, {s.rejected} not accepted.
					</CardContent>
				</Card>
			) : null}

			{doctorScore.data?.eligible && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-lg">
							<span aria-hidden="true" className="text-3xl">🩺</span>
							<span>{doctorScore.data.level > 0 ? levelLabel("healthPartner", doctorScore.data.level) : "Doctor contributions"}</span>
							<Badge variant="secondary">{doctorScore.data.points} points</Badge>
						</CardTitle>
						<CardDescription>
							As a verified doctor you can add health articles, hospital test reviews, medical camps and free consultations.
							{doctorScore.data.pointsToNextLevel != null ? ` ${doctorScore.data.pointsToNextLevel} more points to level ${doctorScore.data.level + 1}.` : " You are at the top level."}
						</CardDescription>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						{doctorScore.data.approved} accepted, {doctorScore.data.pending} waiting, {doctorScore.data.rejected} not accepted.
					</CardContent>
				</Card>
			)}

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Your proposals</CardTitle>
				</CardHeader>
				<CardContent>
					{mine.isError && (
						<Alert variant="destructive">
							<AlertDescription>{mine.error instanceof Error ? mine.error.message : "Could not load your proposals"}</AlertDescription>
						</Alert>
					)}
					{mine.isLoading && <Skeleton className="h-24 w-full" />}
					{mine.data && mine.data.length === 0 && <p className="text-sm text-muted-foreground">You have not added anything yet.</p>}
					<ul className="space-y-2">
						{(mine.data ?? []).map((c) => (
							<li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
								<div>
									<p className="font-medium">
										{KIND_WORDS[c.kind].label}: {c.subjectName ?? `#${c.id}`}
									</p>
									<p className="text-xs text-muted-foreground">
										Sent {dateTime(c.submittedAt)}
										{c.status === "APPROVED" ? `. You earned ${c.pointsAwarded} points.` : ""}
									</p>
									{c.status === "REJECTED" && c.decisionReason && <p className="mt-1 text-sm">Reason: {c.decisionReason}</p>}
								</div>
								<div className="flex items-center gap-2">
									<Badge variant={c.status === "APPROVED" ? "default" : c.status === "REJECTED" ? "destructive" : "secondary"}>{STATUS_WORDS[c.status]}</Badge>
									{c.status === "PENDING" && (
										<Button variant="outline" size="sm" disabled={withdraw.isPending} onClick={() => withdraw.mutate(c.id)}>
											Withdraw
										</Button>
									)}
								</div>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
