import assert from "node:assert/strict";
import test from "node:test";
import { buildDonation, buildRequisition, emptyDonation, emptyRequisition, today } from "./blood-form.ts";

const NOW = new Date("2026-11-02T10:00:00");

const filledRequisition = () => ({ ...emptyRequisition(), patientName: "Rahim", bloodGroup: "O_POSITIVE", hospitalId: 5, contactPhone: "01712345678", neededByDate: today(NOW) });

test("a complete requisition becomes the payload the API expects", () => {
	const built = buildRequisition({ ...filledRequisition(), patientAge: "42", contactPerson: " Karim ", description: "" }, 9, NOW);
	assert.equal(built.ok, true);
	if (built.ok) {
		assert.equal(built.payload.requesterId, 9);
		assert.equal(built.payload.patientAge, 42);
		assert.equal(built.payload.contactPerson, "Karim");
		assert.equal(built.payload.description, undefined);
		assert.equal(built.payload.quantityBags, 1);
		assert.equal(built.payload.bloodComponent, "WHOLE_BLOOD");
	}
});

test("a requisition missing what is required says what, in plain words", () => {
	const built = buildRequisition(emptyRequisition(), undefined, NOW);
	assert.equal(built.ok, false);
	if (!built.ok) {
		assert.ok(built.errors.some((e) => e.includes("profile could not be found")));
		assert.ok(built.errors.some((e) => e.includes("Patient name")));
		assert.ok(built.errors.some((e) => e.includes("blood group")));
		assert.ok(built.errors.some((e) => e.includes("hospital")));
		assert.ok(built.errors.some((e) => e.includes("phone")));
	}
});

test("phone numbers, bags, age and the needed-by date are checked", () => {
	const bad = (over: Record<string, string>) => buildRequisition({ ...filledRequisition(), ...over }, 9, NOW);
	assert.equal(bad({ contactPhone: "12345" }).ok, false);
	assert.equal(bad({ contactPhone: "+8801712345678" }).ok, true);
	assert.equal(bad({ quantityBags: "0" }).ok, false);
	assert.equal(bad({ quantityBags: "2.5" }).ok, false);
	assert.equal(bad({ patientAge: "200" }).ok, false);
	assert.equal(bad({ neededByDate: "2026-11-01" }).ok, false);
	// a requisition already closed may keep an old date
	assert.equal(bad({ neededByDate: "2026-11-01", status: "FULFILLED" }).ok, true);
});

test("a donation needs a donor number, a hospital, a past or present date and a sensible quantity", () => {
	const filled = { ...emptyDonation(), donorId: "12", hospitalId: 3, bloodGroup: "A_NEGATIVE", donationDate: "2026-10-30" };
	const built = buildDonation(filled, NOW);
	assert.equal(built.ok, true);
	if (built.ok) assert.deepEqual(built.payload, { donorId: 12, hospitalId: 3, donationDate: "2026-10-30", bloodGroup: "A_NEGATIVE", bloodComponent: "WHOLE_BLOOD", quantityMl: 450 });
	assert.equal(buildDonation({ ...filled, donorId: "abc" }, NOW).ok, false);
	assert.equal(buildDonation({ ...filled, donationDate: "2026-11-03" }, NOW).ok, false);
	assert.equal(buildDonation({ ...filled, quantityMl: "10" }, NOW).ok, false);
	assert.equal(buildDonation({ ...filled, hospitalId: null }, NOW).ok, false);
});
