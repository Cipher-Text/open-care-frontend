"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Award, Droplet, Stethoscope } from "lucide-react";
import { getSelfProfile } from "@/api/profile";
import { fetchContributionSummary, fetchDoctorContributionSummary } from "@/api/contributions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { levelLabel } from "@/lib/level-labels";
import { qk } from "@/lib/query-keys";

/** One row of the card: what the level is called, what it is made of, and how far the next one is. */
function Row({ href, icon: Icon, title, detail, next, progress }: { href: string; icon: typeof Award; title: string; detail: string; next?: string; progress?: number }) {
	return (
		<Link href={href} className="flex items-start gap-3 rounded-md border p-3 hover:bg-accent">
			<Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
			<div className="min-w-0 flex-1 space-y-1">
				<p className="font-medium">{title}</p>
				<p className="text-sm text-muted-foreground">
					{detail}
					{next ? `. ${next}` : ""}
				</p>
				{progress != null && <Progress value={progress} className="h-2" />}
			</div>
		</Link>
	);
}

/**
 * The person's own levels on the account home: Contributor (from accepted proposals), Health Partner (verified doctors only)
 * and Blood Donor (from their donations). A level the person does not have yet is shown as the first step, not hidden,
 * except Health Partner and Blood Donor, which only appear for people they apply to.
 */
export function LevelsCard() {
	const contributor = useQuery({ queryKey: [...qk.contributionSummary], queryFn: fetchContributionSummary, retry: false });
	const doctor = useQuery({ queryKey: [...qk.doctorContributionSummary], queryFn: fetchDoctorContributionSummary, retry: false });
	const profile = useQuery({ queryKey: [...qk.selfProfile], queryFn: getSelfProfile, retry: false });

	const c = contributor.data;
	const d = doctor.data?.eligible ? doctor.data : null;
	const blood = profile.data?.bloodDonationBadge;
	const donates = blood && blood.bloodDonationCount > 0 ? blood : null;
	if (!c && !d && !donates) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Your levels</CardTitle>
				<CardDescription>What you earn by helping Open Care grow.</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-3 md:grid-cols-3">
				{c && (
					<Row
						href="/account/contributions"
						icon={Award}
						title={c.level > 0 ? levelLabel("contributor", c.level) : "Contributor: no level yet"}
						detail={`${c.points} points`}
						next={c.pointsToNextLevel != null ? `${c.pointsToNextLevel} more points to level ${c.level + 1}` : "Top level"}
					/>
				)}
				{d && (
					<Row
						href="/account/contributions"
						icon={Stethoscope}
						title={d.level > 0 ? levelLabel("healthPartner", d.level) : "Health Partner: no level yet"}
						detail={`${d.points} points`}
						next={d.pointsToNextLevel != null ? `${d.pointsToNextLevel} more points to level ${d.level + 1}` : "Top level"}
					/>
				)}
				{donates && (
					<Row
						href="/account/profile"
						icon={Droplet}
						title={levelLabel("bloodDonor", donates.level)}
						detail={`${donates.bloodDonationCount} ${donates.bloodDonationCount === 1 ? "donation" : "donations"}`}
						next={donates.nextLevelMinDonations != null ? `${donates.donationsToNextLevel} more to level ${donates.level + 1}` : "Top level"}
						progress={donates.progressPercentage}
					/>
				)}
			</CardContent>
		</Card>
	);
}
