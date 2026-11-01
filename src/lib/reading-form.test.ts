import assert from "node:assert/strict";
import test from "node:test";
import { clearedFields, readingGone, type ReadingFormValues } from "./reading-form.ts";

const form = (over: Partial<ReadingFormValues> = {}): ReadingFormValues => ({
	recordedAt: "2026-11-02T08:00", systolic: "120", diastolic: "80", heartRate: "70", glucose: "", glucoseType: "", weight: "", height: "", temperature: "", oxygen: "", symptoms: "", notes: "", ...over,
});

test("a value that was emptied in the form is named, because a change cannot remove it", () => {
	const stored = { bloodPressureSystolic: 120, bloodPressureDiastolic: 80, heartRate: 70, notes: "after walk" };
	assert.deepEqual(clearedFields(stored, form()), ["notes"]);
	assert.deepEqual(clearedFields(stored, form({ heartRate: "", notes: "" })), ["pulse", "notes"]);
	assert.deepEqual(clearedFields(stored, form({ notes: "after walk" })), []);
});

test("a field that was empty before, or is changed to another value, is not reported", () => {
	assert.deepEqual(clearedFields({ bloodPressureSystolic: 120 }, form({ systolic: "130" })), []);
	assert.deepEqual(clearedFields({ weightKg: null, heightCm: undefined }, form()), []);
	assert.deepEqual(clearedFields({ notes: "   " }, form()), []);
});

test("a reading is gone when the server cannot find it or says it was already replaced or deleted", () => {
	assert.equal(readingGone({ status: 404, message: "Health Vital not found with id: 4" }), true);
	assert.equal(readingGone({ status: 422, message: "This reading was already deleted or replaced and cannot be changed" }), true);
	assert.equal(readingGone({ status: 422, message: "Health data consent is required before health vitals can be saved." }), false);
	assert.equal(readingGone({ status: 500, message: "boom" }), false);
	assert.equal(readingGone(new Error("network")), false);
	assert.equal(readingGone(null), false);
});
