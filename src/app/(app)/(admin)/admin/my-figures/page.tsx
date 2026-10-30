"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOwnerStats, type OwnerSubject } from "@/api/owner-stats";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";

const RANGES = [
	{ days: 7, label: "Last 7 days" },
	{ days: 30, label: "Last 30 days" },
	{ days: 90, label: "Last 90 days" },
];

const number = (n: number | null) => (n ?? 0).toLocaleString("en-GB");

function Tile({ label, value }: { label: string; value: number | null }) {
	return (
		<div className="rounded-lg border p-4">
			<p className="text-sm text-muted-foreground">{label}</p>
			<p className="text-3xl font-semibold tabular-nums">{number(value)}</p>
		</div>
	);
}

/** Bars for the busiest measure of the period: views per day, one bar each. Plain markup, no chart library. */
function DailyBars({ subject }: { subject: OwnerSubject }) {
	const max = Math.max(1, ...subject.daily.map((d) => d.views));
	return (
		<div>
			<div className="flex h-24 items-end gap-px" role="img" aria-label="Page views per day">
				{subject.daily.map((d) => (
					<div key={d.day} className="flex-1 rounded-t bg-primary/70" style={{ height: `${Math.max(2, (d.views / max) * 100)}%` }} title={`${d.day}: ${d.views} views, ${d.calls} calls, ${d.directions} directions`} />
				))}
			</div>
			<div className="mt-1 flex justify-between text-xs text-muted-foreground">
				<span>{subject.daily[0]?.day}</span>
				<span>{subject.daily[subject.daily.length - 1]?.day}</span>
			</div>
		</div>
	);
}

function SubjectCard({ subject, days }: { subject: OwnerSubject; days: number }) {
	const href = subject.kind === "DOCTOR" ? `/doctors/${subject.slug}` : `/hospitals/${subject.slug}`;
	return (
		<Card>
			<CardHeader>
				<CardTitle>{subject.name ?? subject.slug}</CardTitle>
				<CardDescription>
					{subject.kind === "DOCTOR" ? "Your doctor page" : "Facility page"} ·{" "}
					<Link href={href} className="underline">
						View the public page
					</Link>
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{subject.allowed ? (
					<>
						<div className="grid gap-3 sm:grid-cols-3">
							<Tile label={`Page views (${days} days)`} value={subject.views} />
							<Tile label="Calls" value={subject.calls} />
							<Tile label="Directions" value={subject.directions} />
						</div>
						<DailyBars subject={subject} />
						<p className="text-xs text-muted-foreground">Counts are anonymous and approximate: robots that run scripts are counted too, and nobody is identified.</p>
					</>
				) : (
					<Alert>
						<AlertDescription className="space-y-2">
							<p>Page views, calls and directions for this facility are part of the Pro plan.</p>
							<Button asChild size="sm" variant="outline">
								<Link href="/pricing">See the plans</Link>
							</Button>
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}

/** How the public used the signed-in person's own pages: views, calls and directions. */
export default function MyFiguresPage() {
	const [days, setDays] = useState(30);
	const stats = useQuery({ queryKey: ["owner-stats", days], queryFn: () => fetchOwnerStats(days), retry: false });

	return (
		<div className="flex flex-col">
			<AdminHeader title="My page figures" description="How people used your doctor page and facility pages" />
			<div className="space-y-4 p-4 pt-6 md:p-8">
				<div className="w-full sm:w-48">
					<NativeSelect aria-label="Period" value={days} onChange={(e) => setDays(Number(e.target.value))}>
						{RANGES.map((r) => (
							<option key={r.days} value={r.days}>
								{r.label}
							</option>
						))}
					</NativeSelect>
				</div>
				{stats.isError ? (
					<Alert variant="destructive">
						<AlertDescription>{stats.error instanceof Error ? stats.error.message : "Could not load your figures"}</AlertDescription>
					</Alert>
				) : stats.isLoading ? (
					<Skeleton className="h-48 w-full" />
				) : (stats.data ?? []).length === 0 ? (
					<Alert>
						<AlertDescription>You have no doctor page or facility of your own yet. A doctor page appears once your doctor record exists; a facility appears once your claim is approved.</AlertDescription>
					</Alert>
				) : (
					(stats.data ?? []).map((s) => <SubjectCard key={`${s.kind}-${s.id}`} subject={s} days={days} />)
				)}
			</div>
		</div>
	);
}
