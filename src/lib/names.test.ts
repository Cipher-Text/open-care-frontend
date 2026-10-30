import assert from "node:assert/strict";
import { test } from "node:test";
import { enumName, localizedNames, placeName } from "./names.ts";

test("in Bangla the Bangla name leads and the English name follows", () => {
	const names = localizedNames("bn", "Lab One Diagnostic Centre", "ল্যাব ওয়ান ডায়াগনস্টিক সেন্টার");
	assert.equal(names.primary, "ল্যাব ওয়ান ডায়াগনস্টিক সেন্টার");
	assert.equal(names.secondary, "Lab One Diagnostic Centre");
	assert.equal(names.secondaryLang, "en");
});

test("in English the English name leads and the Bangla name follows", () => {
	const names = localizedNames("en", "Lab One Diagnostic Centre", "ল্যাব ওয়ান ডায়াগনস্টিক সেন্টার");
	assert.equal(names.primary, "Lab One Diagnostic Centre");
	assert.equal(names.secondary, "ল্যাব ওয়ান ডায়াগনস্টিক সেন্টার");
});

test("the language is read from the letters, so swapped fields still work", () => {
	const names = localizedNames("bn", "ল্যাব ওয়ান ডায়গনোষ্টিক সেন্টার", "Lab One Diagnostic Centre");
	assert.equal(names.primary, "ল্যাব ওয়ান ডায়গনোষ্টিক সেন্টার");
	assert.equal(names.secondary, "Lab One Diagnostic Centre");
});

test("a Bangla name that is only a copy of the English name is not shown twice", () => {
	const names = localizedNames("bn", "Dr. Md Sidur Rahman", "Dr. Md Sidur Rahman");
	assert.equal(names.primary, "Dr. Md Sidur Rahman");
	assert.equal(names.secondary, null);
});

test("zero-width characters are removed and a missing name gives an empty string", () => {
	assert.equal(localizedNames("en", "‍  Sajeda   Alal ‍", null).primary, "Sajeda Alal");
	assert.equal(localizedNames("bn", null, null).primary, "");
});

test("places and enum values follow the language and fall back to English", () => {
	assert.equal(placeName("bn", { name: "Dhaka", bnName: "ঢাকা" }), "ঢাকা");
	assert.equal(placeName("bn", { name: "Dhaka", bnName: " " }), "Dhaka");
	assert.equal(placeName("en", { name: "Dhaka", bnName: "ঢাকা" }), "Dhaka");
	assert.equal(placeName("bn", null), "");
	assert.equal(enumName("bn", { englishName: "NGO Hospital", banglaName: "এনজিও হাসপাতাল" }), "এনজিও হাসপাতাল");
	assert.equal(enumName("en", { displayName: "Private", englishName: "PRIVATE", banglaName: "বেসরকারি" }), "Private");
});
