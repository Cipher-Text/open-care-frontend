import assert from "node:assert/strict";
import test from "node:test";
import { buildDetails, changed, fromProfile } from "./profile-form.ts";

const NOW = new Date("2026-11-02T10:00:00");
const profile = { name: "Rahim", bnName: null, phone: "01712345678", dateOfBirth: "1990-05-01T00:00:00", gender: { value: "MALE" }, address: "House 1", district: { id: 10 }, upazila: { id: 20 }, union: null };

test("the form is filled from the profile and nothing is invented for empty fields", () => {
	const form = fromProfile(profile);
	assert.equal(form.dateOfBirth, "1990-05-01");
	assert.equal(form.gender, "MALE");
	assert.equal(form.districtId, "10");
	assert.equal(form.unionId, "");
	assert.equal(form.bnName, "");
	assert.deepEqual(fromProfile({}), { name: "", bnName: "", phone: "", dateOfBirth: "", gender: "", address: "", districtId: "", upazilaId: "", unionId: "" });
});

test("a good form becomes the payload, with blanks sent as null and spaces and dashes removed from the phone", () => {
	const built = buildDetails({ ...fromProfile(profile), name: " Rahim Uddin ", phone: "017 1234-5678", address: "", unionId: "" }, NOW);
	assert.equal(built.ok, true);
	if (built.ok) {
		assert.equal(built.payload.name, "Rahim Uddin");
		assert.equal(built.payload.phone, "01712345678");
		assert.equal(built.payload.address, null);
		assert.equal(built.payload.bnName, null);
		assert.equal(built.payload.districtId, 10);
		assert.equal(built.payload.unionId, null);
	}
});

test("what is wrong is named in plain words", () => {
	const bad = (over: Record<string, string>) => buildDetails({ ...fromProfile(profile), ...over }, NOW);
	assert.equal(bad({ name: "A" }).ok, false);
	assert.equal(bad({ phone: "12345" }).ok, false);
	assert.equal(bad({ phone: "" }).ok, true);
	assert.equal(bad({ dateOfBirth: "2026-11-03" }).ok, false);
	assert.equal(bad({ dateOfBirth: "1850-01-01" }).ok, false);
	const place = bad({ districtId: "", upazilaId: "20" });
	assert.equal(place.ok, false);
	if (!place.ok) assert.ok(place.errors.some((e) => e.includes("district")));
	assert.equal(bad({ upazilaId: "", unionId: "30" }).ok, false);
});

test("save is offered only when something changed", () => {
	assert.equal(changed(fromProfile(profile), profile), false);
	assert.equal(changed({ ...fromProfile(profile), address: "House 2" }, profile), true);
});
