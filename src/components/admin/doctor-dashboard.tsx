"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, CalendarClock, Minus, ShieldCheck, UserCheck } from "lucide-react";
import { fetchDoctorDashboard, type DoctorDashboard as Data, type Kpi, type LabelCount } from "@/api/doctor-dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const number = (value: number) => value.toLocaleString();
const day = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });

/** Change against the period before. Neutral grey when there is nothing to compare with, never a made-up percentage. */
function Delta({ kpi }: { kpi: Kpi }) {
	if (kpi.changePercent == null) {
		return <span className="text-xs text-muted-foreground">{kpi.current > 0 ? "New this period" : "No activity yet"}</span>;
	}
	const up = kpi.changePercent > 0;
	const flat = kpi.changePercent === 0;
	const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
	return (
		<span className={`inline-flex items-center gap-0.5 text-xs font-medium ${flat ? "text-muted-foreground" : up ? "text-green-700" : "text-red-700"}`}>
			<Icon className="size-3.5" aria-hidden="true" />
			{Math.abs(kpi.changePercent)}% <span className="font-normal text-muted-foreground">vs previous period</span>
		</span>
	);
}

function KpiCard({ title, value, hint, kpi }: { title: string; value: string; hint?: string; kpi?: Kpi }) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-1">
				<div className="text-2xl font-bold">{value}</div>
				{kpi ? <Delta kpi={kpi} /> : <span className="text-xs text-muted-foreground">{hint}</span>}
			</CardContent>
		</Card>
	);
}

function RankedList({ title, description, rows, empty }: { title: string; description: string; rows: LabelCount[]; empty: string }) {
	const max = Math.max(1, ...rows.map((row) => row.total));
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{rows.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
				{rows.map((row) => (
					<div key={row.label} className="space-y-1">
						<div className="flex justify-between gap-2 text-sm">
							<span className="truncate capitalize">{row.label}</span>
							<span className="tabular-nums text-muted-foreground">{number(row.total)}</span>
						</div>
						<div className="h-1.5 rounded-full bg-muted">
							<div className="h-1.5 rounded-full bg-primary" style={{ width: `${(row.total / max) * 100}%` }} />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export function DoctorDashboard() {
	const { data, isLoading, isError, error } = useQuery<Data>({
		queryKey: ["doctor-dashboard"],
		queryFn: fetchDoctorDashboard,
		staleTime: 60_000,
		refetchInterval: 60_000,
	});

	if (isError) {
		return (
			<Alert>
				<AlertDescription>{(error as Error).message}</AlertDescription>
			</Alert>
		);
	}
	if (isLoading || !data) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-16 w-full" />
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{[0, 1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-28" />
					))}
				</div>
				<Skeleton className="h-56 w-full" />
			</div>
		);
	}

	const { consents, followUps, readiness, access } = data;
	const attention = [
		{ show: followUps.overdue > 0, text: `${followUps.overdue} follow-up${followUps.overdue === 1 ? "" : "s"} overdue`, href: "/admin/prescriptions", icon: CalendarClock },
		{ show: consents.waiting > 0, text: `${consents.waiting} consent request${consents.waiting === 1 ? "" : "s"} waiting for the patient`, href: "/admin/prescriptions", icon: UserCheck },
		{ show: access.expiringWithin24h > 0, text: `${access.expiringWithin24h} patient access expiring within 24 hours`, href: "/admin/prescriptions", icon: ShieldCheck },
		{ show: !readiness.verified, text: "Your doctor profile is not verified yet", href: "/admin/doctors/me", icon: BadgeCheck },
		{ show: readiness.completenessPercent < 100, text: `Profile ${readiness.completenessPercent}% complete`, href: "/admin/doctors/me", icon: AlertTriangle },
	].filter((item) => item.show);

	const maxWeek = Math.max(1, ...data.weeklyPrescriptions.map((w) => w.prescriptions));
	const funnel = [
		{ label: "Approved", value: consents.approved, color: "bg-green-600" },
		{ label: "Denied", value: consents.denied, color: "bg-red-600" },
		{ label: "Expired", value: consents.expired, color: "bg-amber-500" },
		{ label: "Cancelled", value: consents.cancelled, color: "bg-slate-400" },
		{ label: "Waiting", value: consents.waiting, color: "bg-blue-500" },
	];

	return (
		<div className="space-y-6">
			{attention.length > 0 && (
				<Card className="border-amber-300 bg-amber-50/60 dark:bg-amber-950/20">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Needs your attention</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-wrap gap-2">
						{attention.map(({ text, href, icon: Icon }) => (
							<Link key={text} href={href} className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm hover:bg-accent">
								<Icon className="size-4 text-amber-600" aria-hidden="true" />
								{text}
							</Link>
						))}
					</CardContent>
				</Card>
			)}

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard title={`Prescriptions, last ${data.periodDays} days`} value={number(data.prescriptions.current)} kpi={data.prescriptions} />
				<KpiCard title={`Patients seen, last ${data.periodDays} days`} value={number(data.patients.current)} kpi={data.patients} />
				<KpiCard
					title="Returning patients"
					value={number(data.returningPatients)}
					hint={data.patients.current > 0 ? `${Math.round((data.returningPatients * 100) / data.patients.current)}% of patients seen, also seen the period before` : "Seen in both of the last two periods"}
				/>
				<KpiCard
					title="Consent approval rate"
					value={consents.approvalRatePercent == null ? "-" : `${consents.approvalRatePercent}%`}
					hint={`${number(consents.requested)} request${consents.requested === 1 ? "" : "s"} in ${data.periodDays} days`}
				/>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-lg">Prescriptions per week</CardTitle>
						<CardDescription>Last 12 weeks, weeks start on Monday. The current week is still in progress.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex h-40 items-end gap-1.5" role="img" aria-label="Prescriptions written per week, last 12 weeks">
							{data.weeklyPrescriptions.map((week, index) => (
								<div key={week.weekStart} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`Week of ${day(week.weekStart)}: ${week.prescriptions} prescriptions, ${week.patients} patients`}>
									<span className="text-[10px] tabular-nums text-muted-foreground">{week.prescriptions || ""}</span>
									<div
										className={`w-full rounded-t ${index === data.weeklyPrescriptions.length - 1 ? "bg-primary/50" : "bg-primary"}`}
										style={{ height: `${Math.max((week.prescriptions / maxWeek) * 100, week.prescriptions > 0 ? 4 : 1)}%` }}
									/>
								</div>
							))}
						</div>
						<div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
							<span>{day(data.weeklyPrescriptions[0].weekStart)}</span>
							<span>{day(data.weeklyPrescriptions[data.weeklyPrescriptions.length - 1].weekStart)}</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Patient consent</CardTitle>
						<CardDescription>How your requests ended, last {data.periodDays} days.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{consents.requested === 0 ? (
							<p className="text-sm text-muted-foreground">You have not asked a patient for consent in this period.</p>
						) : (
							<>
								<div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label="Consent outcomes">
									{funnel.map((part) => (
										<div key={part.label} className={part.color} style={{ width: `${(part.value / consents.requested) * 100}%` }} />
									))}
								</div>
								<ul className="space-y-1 text-sm">
									{funnel.map((part) => (
										<li key={part.label} className="flex items-center justify-between">
											<span className="flex items-center gap-2">
												<span className={`size-2.5 rounded-full ${part.color}`} aria-hidden="true" />
												{part.label}
											</span>
											<span className="tabular-nums">{number(part.value)}</span>
										</li>
									))}
								</ul>
							</>
						)}
						<p className="border-t pt-2 text-xs text-muted-foreground">{number(access.activeGrants)} patient{access.activeGrants === 1 ? "" : "s"} you can prescribe for right now.</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Follow-ups due</CardTitle>
						<CardDescription>Due in the next 7 days or overdue by up to 14, for patients you have not prescribed for since.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						{followUps.items.length === 0 && <p className="text-sm text-muted-foreground">No follow-ups are due.</p>}
						{followUps.items.map((item) => (
							<Link key={item.prescriptionId} href={`/admin/prescriptions/${item.prescriptionId}`} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent">
								<span className="min-w-0">
									<span className="block truncate font-medium">{item.patientName}</span>
									<span className="text-xs text-muted-foreground">{item.prescriptionNo}</span>
								</span>
								<span className={`shrink-0 text-xs font-medium ${item.overdue ? "text-red-700" : "text-muted-foreground"}`}>
									{item.overdue ? "Overdue " : "Due "}
									{day(item.dueDate)}
								</span>
							</Link>
						))}
						{followUps.overdue + followUps.dueSoon > followUps.items.length && (
							<Link href="/admin/prescriptions" className="flex items-center gap-1 pt-1 text-sm text-primary hover:underline">
								All prescriptions <ArrowRight className="size-3.5" aria-hidden="true" />
							</Link>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Your profile</CardTitle>
						<CardDescription>A complete, verified profile is what patients see in the directory.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span>Completeness</span>
							<span className="font-medium tabular-nums">{readiness.completenessPercent}%</span>
						</div>
						<Progress value={readiness.completenessPercent} aria-label="Profile completeness" />
						<p className="text-sm">
							{readiness.verified ? "Verified by Open Care." : "Waiting for verification."} {readiness.active ? "" : "Your profile is currently inactive."}
						</p>
						{readiness.missing.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{readiness.missing.map((item) => (
									<Link key={item} href="/admin/doctors/me" className="rounded-md border px-2.5 py-1 text-xs hover:bg-accent">
										Add: {item}
									</Link>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<RankedList title="Top diagnoses" description="Last 90 days. Grouped by the text you wrote, so spelling differences count separately." rows={data.topDiagnoses} empty="Diagnoses will appear once you have written prescriptions." />
				<RankedList title="Most prescribed medicines" description="Last 90 days, by number of prescription lines." rows={data.topMedicines} empty="Medicines will appear once you have written prescriptions." />
			</div>
		</div>
	);
}
