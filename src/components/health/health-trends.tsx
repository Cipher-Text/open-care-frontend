"use client";

import { useMemo, useState } from "react";
import { qk } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { fetchMyReadings } from "@/api/health-vitals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { METRICS, buildSeries, domainOf, latestChange, pathOf, place, show, type Box } from "@/lib/trend";

const BOX: Box = { width: 640, height: 240, left: 48, right: 16, top: 16, bottom: 32 };
const LINE_CLASSES = ["stroke-primary fill-primary", "stroke-destructive fill-destructive"];
const NEWEST = 100;

const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

/**
 * How the person's own readings changed over time: one chart per kind of reading (blood pressure, pulse, blood sugar,
 * weight, temperature, oxygen) from their newest 100 readings. It shows numbers and a line, never a verdict: what a reading
 * means is for the person's doctor.
 */
export function HealthTrends() {
	const [metricKey, setMetricKey] = useState(METRICS[0].key);
	// Under "my-readings" so that saving or deleting a reading refreshes the chart as well
	const query = useQuery({ queryKey: [...qk.myReadings, "trend"], queryFn: () => fetchMyReadings(1, NEWEST), retry: false });
	const metric = METRICS.find((m) => m.key === metricKey) ?? METRICS[0];

	const chart = useMemo(() => {
		const readings = query.data?.content ?? [];
		const series = metric.lines.map((line) => buildSeries(readings, line.pick));
		const domain = domainOf(series);
		return { series, domain, placed: domain ? series.map((points) => place(points, domain, BOX)) : [] };
	}, [query.data, metric]);

	const counts = useMemo(() => {
		const readings = query.data?.content ?? [];
		return Object.fromEntries(METRICS.map((m) => [m.key, Math.max(...m.lines.map((l) => buildSeries(readings, l.pick).length))]));
	}, [query.data]);

	const longest = Math.max(0, ...chart.series.map((s) => s.length));
	const first = chart.series.flat().sort((a, b) => a.t - b.t)[0];
	const last = chart.series.flat().sort((a, b) => b.t - a.t)[0];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Trends</CardTitle>
				<CardDescription>How your readings changed. This shows numbers only: ask your doctor what they mean for you.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-wrap gap-2" role="group" aria-label="Kind of reading">
					{METRICS.map((m) => (
						<Button key={m.key} size="sm" variant={m.key === metric.key ? "default" : "outline"} onClick={() => setMetricKey(m.key)} aria-pressed={m.key === metric.key}>
							{m.label}
							<span className="ml-1.5 text-xs opacity-70">{counts[m.key] ?? 0}</span>
						</Button>
					))}
				</div>

				{query.isLoading ? (
					<Skeleton className="h-60 w-full" />
				) : query.isError ? (
					<p className="text-sm text-muted-foreground">Could not load your readings for the chart.</p>
				) : longest < 2 || !chart.domain ? (
					<p className="text-sm text-muted-foreground">
						{longest === 1 ? `Only one ${metric.label.toLowerCase()} reading so far.` : `No ${metric.label.toLowerCase()} readings yet.`} A trend needs at least two: record another one.
					</p>
				) : (
					<>
						<svg viewBox={`0 0 ${BOX.width} ${BOX.height}`} className="h-auto w-full" role="img"
							aria-label={`${metric.label} over time, ${longest} readings from ${first ? day(first.at) : ""} to ${last ? day(last.at) : ""}`}>
							{/* the value range, as three guide lines */}
							{[chart.domain.vMax, (chart.domain.vMax + chart.domain.vMin) / 2, chart.domain.vMin].map((v, i) => {
								const y = BOX.top + (i * (BOX.height - BOX.top - BOX.bottom)) / 2;
								return (
									<g key={i}>
										<line x1={BOX.left} x2={BOX.width - BOX.right} y1={y} y2={y} className="stroke-border" strokeWidth={1} />
										<text x={BOX.left - 6} y={y + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">{show(v)}</text>
									</g>
								);
							})}
							{first && <text x={BOX.left} y={BOX.height - 8} className="fill-muted-foreground text-[11px]">{day(first.at)}</text>}
							{last && last.t !== first?.t && <text x={BOX.width - BOX.right} y={BOX.height - 8} textAnchor="end" className="fill-muted-foreground text-[11px]">{day(last.at)}</text>}
							{chart.placed.map((points, li) => (
								<g key={metric.lines[li].label} className={LINE_CLASSES[li % LINE_CLASSES.length]}>
									<path d={pathOf(points)} fill="none" strokeWidth={2} />
									{points.map((p) => (
										<circle key={p.at + p.value} cx={p.x} cy={p.y} r={3.5} stroke="none">
											<title>{`${metric.lines[li].label} ${show(p.value)} ${metric.unit}, ${when(p.at)}`}</title>
										</circle>
									))}
								</g>
							))}
						</svg>
						<ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
							{metric.lines.map((line, li) => {
								const summary = latestChange(chart.series[li]);
								return (
									<li key={line.label} className="flex items-center gap-2">
										<span className={`inline-block size-2.5 rounded-full ${li % 2 === 0 ? "bg-primary" : "bg-destructive"}`} aria-hidden="true" />
										<span className="font-medium">{line.label}</span>
										{summary ? (
											<span className="text-muted-foreground">
												{show(summary.latest.value)} {metric.unit} on {day(summary.latest.at)}
												{summary.change !== null && summary.change !== 0 ? `, ${summary.change > 0 ? "up" : "down"} ${show(Math.abs(summary.change))} since the one before` : summary.change === 0 ? ", the same as the one before" : ""}
											</span>
										) : (
											<span className="text-muted-foreground">no readings</span>
										)}
									</li>
								);
							})}
						</ul>
						<p className="text-xs text-muted-foreground">From your newest {NEWEST} readings. Hover or focus a dot to see its date.</p>
					</>
				)}
			</CardContent>
		</Card>
	);
}
