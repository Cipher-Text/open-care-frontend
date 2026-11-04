import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { capabilitiesShape, checked, consentRequestShape, pageShape, patientLookupShape, slotListShape, UnexpectedAnswerError } from "./api-shapes.ts";

describe("api answer shapes", () => {
	it("accepts a normal page and an empty one", () => {
		assert.doesNotThrow(() => checked(pageShape, { content: [{ id: 1 }], currentPage: 0, totalItems: 1, totalPages: 1 }, "list"));
		assert.doesNotThrow(() => checked(pageShape, {}, "list"));
		assert.doesNotThrow(() => checked(pageShape, { content: null, totalItems: null }, "list"));
	});

	it("refuses a page whose parts have the wrong type", () => {
		for (const bad of [{ content: "x" }, { content: {} }, { totalItems: "12" }, { totalPages: -1 }, { currentPage: 1.5 }, null, "page"]) {
			assert.throws(() => checked(pageShape, bad, "list"), UnexpectedAnswerError);
		}
	});

	it("accepts real capabilities and refuses ones that could be misread as 'no permissions'", () => {
		assert.deepEqual(checked(capabilitiesShape, { userType: "DOCTOR", permissions: ["a"], features: { x: true } }, "capabilities").permissions, ["a"]);
		assert.doesNotThrow(() => checked(capabilitiesShape, { userType: null, permissions: [], features: {} }, "capabilities"));
		for (const bad of [{}, { userType: "X", permissions: "a", features: {} }, { userType: "X", permissions: [1], features: {} }, { userType: "X", permissions: [], features: { a: "yes" } }, []]) {
			assert.throws(() => checked(capabilitiesShape, bad, "capabilities"), UnexpectedAnswerError);
		}
	});

	it("checks the open times and refuses a list that could be read as 'bookable' by mistake", () => {
		const ok = { bookable: true, message: null, slots: [{ date: "2026-11-10", startTime: "18:00:00", endTime: "18:20:00", durationMinutes: 20, fee: 500 }] };
		assert.equal(checked(slotListShape, ok, "open times").slots.length, 1);
		assert.doesNotThrow(() => checked(slotListShape, { bookable: false, message: "Not yet", slots: [] }, "open times"));
		for (const bad of [{ slots: [] }, { bookable: "yes", slots: [] }, { bookable: true, slots: [{ date: "2026-11-10" }] }, { bookable: true, slots: "none" }]) {
			assert.throws(() => checked(slotListShape, bad, "open times"), UnexpectedAnswerError);
		}
	});

	it("checks the consent request and the patient lookup that start a prescription", () => {
		assert.equal(checked(consentRequestShape, { id: 5, status: "APPROVED", extra: 1 }, "consent request").status, "APPROVED");
		for (const bad of [{ id: 5 }, { id: "5", status: "APPROVED" }, { id: 5, status: "GRANTED" }, null]) {
			assert.throws(() => checked(consentRequestShape, bad, "consent request"), UnexpectedAnswerError);
		}
		assert.equal(checked(patientLookupShape, { profileId: 30, name: "R" }, "patient").profileId, 30);
		assert.throws(() => checked(patientLookupShape, { profileId: 0 }, "patient"), UnexpectedAnswerError);
	});
});
