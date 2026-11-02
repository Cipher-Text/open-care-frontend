/**
 * Pure rules of the trend chart on the health readings screen (no chart library): which readings make a line, how the
 * lines are scaled into an SVG, and what the chart says in words. Kept free of React so it can be tested.
 */

export interface TrendReading {
	recordedAt: string;
	bloodPressureSystolic?: number | null;
	bloodPressureDiastolic?: number | null;
	heartRate?: number | null;
	bloodGlucoseMgDl?: number | null;
	weightKg?: number | null;
	temperatureCelsius?: number | null;
	oxygenSaturation?: number | null;
}

export interface TrendLine {
	label: string;
	pick: (r: TrendReading) => number | null | undefined;
}

export interface TrendMetric {
	key: string;
	label: string;
	unit: string;
	lines: TrendLine[];
}

export const METRICS: TrendMetric[] = [
	{ key: "bp", label: "Blood pressure", unit: "mmHg", lines: [{ label: "Upper", pick: (r) => r.bloodPressureSystolic }, { label: "Lower", pick: (r) => r.bloodPressureDiastolic }] },
	{ key: "pulse", label: "Pulse", unit: "per minute", lines: [{ label: "Pulse", pick: (r) => r.heartRate }] },
	{ key: "glucose", label: "Blood sugar", unit: "mg/dL", lines: [{ label: "Blood sugar", pick: (r) => r.bloodGlucoseMgDl }] },
	{ key: "weight", label: "Weight", unit: "kg", lines: [{ label: "Weight", pick: (r) => r.weightKg }] },
	{ key: "temperature", label: "Temperature", unit: "°C", lines: [{ label: "Temperature", pick: (r) => r.temperatureCelsius }] },
	{ key: "oxygen", label: "Oxygen", unit: "%", lines: [{ label: "Oxygen", pick: (r) => r.oxygenSaturation }] },
];

export interface Point {
	t: number;
	value: number;
	at: string;
}

/** The readings that have this value, oldest first. A missing value or an unreadable date is left out. */
export function buildSeries(readings: TrendReading[], pick: TrendLine["pick"]): Point[] {
	const points: Point[] = [];
	for (const reading of readings) {
		const value = pick(reading);
		const t = new Date(reading.recordedAt).getTime();
		if (value === null || value === undefined || !Number.isFinite(value) || !Number.isFinite(t)) continue;
		points.push({ t, value, at: reading.recordedAt });
	}
	return points.sort((a, b) => a.t - b.t);
}

export interface Domain {
	tMin: number;
	tMax: number;
	vMin: number;
	vMax: number;
}

/** The time and value range of all lines together, with a little room above and below so a flat line is not on the edge. */
export function domainOf(series: Point[][]): Domain | null {
	const all = series.flat();
	if (all.length === 0) return null;
	const values = all.map((p) => p.value);
	const times = all.map((p) => p.t);
	let vMin = Math.min(...values);
	let vMax = Math.max(...values);
	const room = vMax === vMin ? Math.max(Math.abs(vMax) * 0.05, 1) : (vMax - vMin) * 0.1;
	vMin -= room;
	vMax += room;
	return { tMin: Math.min(...times), tMax: Math.max(...times), vMin, vMax };
}

export interface Box {
	width: number;
	height: number;
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface Placed extends Point {
	x: number;
	y: number;
}

/** Puts points on the chart: time runs left to right, a bigger value is higher. One moment alone sits in the middle. */
export function place(points: Point[], domain: Domain, box: Box): Placed[] {
	const w = box.width - box.left - box.right;
	const h = box.height - box.top - box.bottom;
	const span = domain.tMax - domain.tMin;
	return points.map((p) => ({
		...p,
		x: box.left + (span === 0 ? w / 2 : ((p.t - domain.tMin) / span) * w),
		y: box.top + h - ((p.value - domain.vMin) / (domain.vMax - domain.vMin)) * h,
	}));
}

/** An SVG path through the placed points. */
export function pathOf(points: Placed[]): string {
	return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
}

/** The latest value of a line and how it changed since the one before; null when there is no value. */
export function latestChange(points: Point[]): { latest: Point; change: number | null } | null {
	if (points.length === 0) return null;
	const latest = points[points.length - 1];
	return { latest, change: points.length > 1 ? latest.value - points[points.length - 2].value : null };
}

/** Round to at most one decimal for display. */
export function show(value: number): string {
	return String(Math.round(value * 10) / 10);
}
