import assert from "node:assert/strict";
import test from "node:test";
import { METRICS, buildSeries, domainOf, latestChange, pathOf, place, show } from "./trend.ts";

const readings = [
	{ recordedAt: "2026-10-03T08:00:00", bloodPressureSystolic: 130, bloodPressureDiastolic: 85, heartRate: 80 },
	{ recordedAt: "2026-10-01T08:00:00", bloodPressureSystolic: 120, bloodPressureDiastolic: 80 },
	{ recordedAt: "2026-10-02T08:00:00", heartRate: 72 },
	{ recordedAt: "not a date", heartRate: 60 },
];
const bp = METRICS.find((m) => m.key === "bp")!;
const pulse = METRICS.find((m) => m.key === "pulse")!;

test("a line holds only the readings that have the value, oldest first, and skips unreadable dates", () => {
	const upper = buildSeries(readings, bp.lines[0].pick);
	assert.deepEqual(upper.map((p) => p.value), [120, 130]);
	const heart = buildSeries(readings, pulse.lines[0].pick);
	assert.deepEqual(heart.map((p) => p.value), [72, 80]);
});

test("the range has room around the values, and none for no data", () => {
	assert.equal(domainOf([]), null);
	const domain = domainOf([buildSeries(readings, bp.lines[0].pick), buildSeries(readings, bp.lines[1].pick)])!;
	assert.ok(domain.vMin < 80 && domain.vMax > 130);
	const flat = domainOf([[{ t: 1, value: 70, at: "x" }]])!;
	assert.ok(flat.vMin < 70 && flat.vMax > 70);
});

test("points are placed with time to the right and a bigger value higher, and a lone moment sits in the middle", () => {
	const box = { width: 600, height: 200, left: 40, right: 10, top: 10, bottom: 20 };
	const series = buildSeries(readings, bp.lines[0].pick);
	const placed = place(series, domainOf([series])!, box);
	assert.ok(placed[1].x > placed[0].x);
	assert.ok(placed[1].y < placed[0].y);
	assert.ok(placed.every((p) => p.x >= box.left && p.x <= box.width - box.right && p.y >= box.top && p.y <= box.height - box.bottom));
	const lone = place([{ t: 5, value: 70, at: "x" }], domainOf([[{ t: 5, value: 70, at: "x" }]])!, box);
	assert.equal(lone[0].x, box.left + (box.width - box.left - box.right) / 2);
	assert.match(pathOf(placed), /^M[\d.]+ [\d.]+ L[\d.]+ [\d.]+$/);
});

test("the latest value and its change since the one before are named, and numbers are shown to one decimal", () => {
	const series = buildSeries(readings, bp.lines[0].pick);
	assert.deepEqual(latestChange(series)?.change, 10);
	assert.equal(latestChange(series)?.latest.value, 130);
	assert.equal(latestChange([]), null);
	assert.equal(latestChange([series[0]])?.change, null);
	assert.equal(show(36.666), "36.7");
	assert.equal(show(120), "120");
});
