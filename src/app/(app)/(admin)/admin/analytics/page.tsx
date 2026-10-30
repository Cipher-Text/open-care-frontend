"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventSummary, fetchRecordDaily, fetchSearchMetrics, fetchTopRecords, type EventKind, type EventType } from "@/api/analytics";
import { AdminHeader } from "@/components/admin/admin-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TYPE_LABEL: Record<EventType, string> = { VIEW: "Page views", CALL: "Calls", DIRECTIONS: "Directions" };

function DailyBars({ kind, slug, type, days }: { kind: EventKind; slug: string; type: EventType; days: number }) {
	const daily = useQuery({ queryKey: ["analytics-daily", kind, slug, type, days], queryFn: () => fetchRecordDaily(kind, slug, type, days) });
	if (daily.isError) return <p className="text-sm text-destructive">Could not load the daily counts.</p>;
	const series = daily.data ?? [];
	const max = Math.max(1, ...series.map((d) => d.total));
	return (
		<div>
			<div className="flex h-24 items-end gap-px" role="img" aria-label={`${TYPE_LABEL[type]} per day for the last ${days} days, most on one day: ${max}`}>
				{series.map((d) => (
					<div key={d.day} title={`${d.day}: ${d.total}`} className="flex-1 rounded-t bg-primary/70" style={{ height: `${Math.max(2, (d.total / max) * 100)}%` }} />
				))}
			</div>
			<p className="mt-1 text-xs text-muted-foreground">
				{series[0]?.day} to {series[series.length - 1]?.day}. Total {series.reduce((sum, d) => sum + d.total, 0)}.
			</p>
		</div>
	);
}

/** Anonymous counts of what visitors do on public doctor and hospital pages, and how the public searches perform. */
export default function AnalyticsPage() {
	const [days, setDays] = useState(30);
	const [kind, setKind] = useState<EventKind>("HOSPITAL");
	const [type, setType] = useState<EventType>("VIEW");
	const [selected, setSelected] = useState<string | null>(null);
	const summary = useQuery({ queryKey: ["analytics-summary", days], queryFn: () => fetchEventSummary(days) });
	const top = useQuery({ queryKey: ["analytics-top", kind, type, days], queryFn: () => fetchTopRecords(kind, type, days, 10) });
	const search = useQuery({ queryKey: ["analytics-search"], queryFn: fetchSearchMetrics });
	const sum = (k: EventKind, t: EventType) => (summary.data ?? []).find((s) => s.kind === k && s.eventType === t)?.total ?? 0;

	return (
		<div className="flex flex-col">
			<AdminHeader title="Usage figures" description="Anonymous counts: no cookie, address or account is attached to any of them" />
			<div className="space-y-6 p-4 pt-6 md:p-8">
				<div className="w-full sm:w-52">
					<NativeSelect aria-label="Period" value={days} onChange={(e) => { setDays(Number(e.target.value)); setSelected(null); }}>
						<option value={7}>Last 7 days</option>
						<option value={30}>Last 30 days</option>
						<option value={90}>Last 90 days</option>
						<option value={365}>Last 365 days</option>
					</NativeSelect>
				</div>
				{summary.isError && (
					<Alert variant="destructive">
						<AlertDescription>{summary.error instanceof Error ? summary.error.message : "Could not load the totals"}</AlertDescription>
					</Alert>
				)}
				<div className="grid gap-4 sm:grid-cols-2">
					{(["HOSPITAL", "DOCTOR"] as EventKind[]).map((k) => (
						<Card key={k}>
							<CardHeader>
								<CardTitle className="text-base">{k === "HOSPITAL" ? "Facility pages" : "Doctor pages"}</CardTitle>
								<CardDescription>Last {days} days. Bots that run scripts are counted too, so read the numbers as approximate.</CardDescription>
							</CardHeader>
							<CardContent>
								<dl className="grid grid-cols-3 gap-2 text-center">
									{(["VIEW", "CALL", "DIRECTIONS"] as EventType[])
										.filter((t) => k === "HOSPITAL" || t !== "DIRECTIONS")
										.map((t) => (
											<div key={t}>
												<dd className="text-2xl font-bold">{sum(k, t).toLocaleString("en-GB")}</dd>
												<dt className="text-xs text-muted-foreground">{TYPE_LABEL[t]}</dt>
											</div>
										))}
								</dl>
							</CardContent>
						</Card>
					))}
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Most {TYPE_LABEL[type].toLowerCase()}</CardTitle>
						<div className="flex flex-wrap gap-2 pt-2">
							<div className="w-40">
								<NativeSelect aria-label="Kind" value={kind} onChange={(e) => { setKind(e.target.value as EventKind); setSelected(null); }}>
									<option value="HOSPITAL">Facilities</option>
									<option value="DOCTOR">Doctors</option>
								</NativeSelect>
							</div>
							<div className="w-40">
								<NativeSelect aria-label="Event" value={type} onChange={(e) => { setType(e.target.value as EventType); setSelected(null); }}>
									<option value="VIEW">Page views</option>
									<option value="CALL">Calls</option>
									<option value="DIRECTIONS">Directions</option>
								</NativeSelect>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead className="text-right">Count</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(top.data ?? []).map((row) => (
									<TableRow key={row.recordId} className={row.slug === selected ? "bg-muted" : undefined}>
										<TableCell>
											<button type="button" className="text-left font-medium text-primary hover:underline" onClick={() => setSelected(row.slug)} disabled={!row.slug}>
												{row.name ?? `#${row.recordId}`}
											</button>
										</TableCell>
										<TableCell className="text-right">{row.total.toLocaleString("en-GB")}</TableCell>
									</TableRow>
								))}
								{top.data && top.data.length === 0 && (
									<TableRow>
										<TableCell colSpan={2} className="text-center text-muted-foreground">
											Nothing counted in this period.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
						{selected && <DailyBars kind={kind} slug={selected} type={type} days={days} />}
						{!selected && (top.data ?? []).length > 0 && <p className="text-xs text-muted-foreground">Choose a name to see its counts day by day.</p>}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Public searches</CardTitle>
						<CardDescription>Since this server started (held in memory, this server only). Nothing about what was searched for is kept here.</CardDescription>
					</CardHeader>
					<CardContent>
						{search.isError && <p className="text-sm text-destructive">Could not load the search figures.</p>}
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Search</TableHead>
									<TableHead className="text-right">Searches</TableHead>
									<TableHead className="text-right">Average (ms)</TableHead>
									<TableHead className="text-right">Slowest (ms)</TableHead>
									<TableHead className="text-right">Found nothing</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(search.data ?? []).map((row) => (
									<TableRow key={`${row.entity}-${row.filtered}`}>
										<TableCell>
											{row.entity === "doctor" ? "Doctors" : "Facilities"}, {row.filtered ? "with a filter or text" : "the plain list"}
										</TableCell>
										<TableCell className="text-right">{row.searches}</TableCell>
										<TableCell className="text-right">{row.meanMillis ?? "-"}</TableCell>
										<TableCell className="text-right">{row.maxMillis ?? "-"}</TableCell>
										<TableCell className="text-right">{row.zeroResults}</TableCell>
									</TableRow>
								))}
								{search.data && search.data.length === 0 && (
									<TableRow>
										<TableCell colSpan={5} className="text-center text-muted-foreground">
											No public search has run since the server started.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
