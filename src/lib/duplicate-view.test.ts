import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canCheck, hasStrongMatch, recordHref, sortCandidates } from "./duplicate-view.ts";

describe("duplicate view rules", () => {
	it("sends a check only with 3 letters of a name or 3 characters of a number", () => {
		assert.equal(canCheck("ab", undefined), false);
		assert.equal(canCheck("  ab ", ""), false);
		assert.equal(canCheck("Lab", undefined), true);
		assert.equal(canCheck("", "A12"), true);
		assert.equal(canCheck(undefined, undefined), false);
	});

	it("lists strong matches first, then the closest", () => {
		const sorted = sortCandidates([
			{ reason: "SIMILAR_NAME" as const, score: 0.9 },
			{ reason: "SAME_NAME" as const, score: 1 },
			{ reason: "SAME_KEY" as const, score: 1 },
			{ reason: "SAME_NAME_SAME_PLACE" as const, score: 1 },
		]);
		assert.deepEqual(sorted.map((c) => c.reason), ["SAME_KEY", "SAME_NAME_SAME_PLACE", "SAME_NAME", "SIMILAR_NAME"]);
	});

	it("stops a form only for a strong match", () => {
		assert.equal(hasStrongMatch([{ reason: "SIMILAR_NAME" }, { reason: "SAME_NAME" }, { reason: "SAME_DIGITS" }]), false);
		assert.equal(hasStrongMatch([{ reason: "SIMILAR_NAME" }, { reason: "SAME_NAME_SAME_PLACE" }]), true);
	});

	it("links each kind to its staff page", () => {
		assert.equal(recordHref("HOSPITAL", 7), "/admin/hospitals/7/view");
		assert.equal(recordHref("DOCTOR", 7), "/admin/doctors/7/view");
		assert.equal(recordHref("AMBULANCE", 7), "/admin/ambulances/7/view");
		assert.equal(recordHref("NURSE", 7), "/admin/nurses");
		assert.equal(recordHref("NUTRITIONIST", 7), "/admin/nutritionists");
	});
});
