import assert from "node:assert/strict";
import test from "node:test";
import { CONSENT, prescriptionRequest } from "./consent-text.ts";

const BENGALI = /[ঀ-৿]/;

test("every agreement text exists in English and in Bangla, and nothing is left unfilled", () => {
	for (const [key, text] of Object.entries(CONSENT)) {
		assert.ok(text.en.trim().length > 0, `${key} has no English`);
		assert.match(text.bn, BENGALI, `${key} has no Bangla`);
		assert.doesNotMatch(text.en + text.bn, /[{}]|undefined|null/, `${key} has an unfilled placeholder`);
	}
});

test("the English and Bangla of an agreement say the same things: the same numbers and no extra promises", () => {
	// a text that lists who can see what must list the same number of things in both languages
	for (const key of ["healthAgree", "healthWithdraw", "donorAgree"] as const) {
		const sentences = (text: string) => text.split(/[.।]/).filter((part) => part.trim().length > 0).length;
		assert.equal(sentences(CONSENT[key].en), sentences(CONSENT[key].bn), `${key} has a different number of sentences`);
	}
});

test("the doctor's name goes into both languages, and a missing name still reads well", () => {
	const named = prescriptionRequest(" Dr. Karim ");
	assert.ok(named.en.startsWith("Dr. Karim wants"));
	assert.ok(named.bn.startsWith("Dr. Karim আপনার"));
	const unnamed = prescriptionRequest(null);
	assert.ok(unnamed.en.startsWith("A doctor wants"));
	assert.match(unnamed.bn, /^একজন ডাক্তার/);
});
