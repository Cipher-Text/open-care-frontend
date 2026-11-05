import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { KIND_WORDS, REQUEST_KEY, textToHtml } from "./contribution-kind.ts";
import { levelLabel } from "./level-labels.ts";

describe("textToHtml", () => {
	it("makes a paragraph of each block separated by a blank line", () => {
		assert.equal(textToHtml("First paragraph.\n\nSecond paragraph."), "<p>First paragraph.</p><p>Second paragraph.</p>");
	});

	it("keeps a single line break inside a paragraph", () => {
		assert.equal(textToHtml("Line one\nLine two"), "<p>Line one<br>Line two</p>");
	});

	it("never lets the person type markup: tags and ampersands are escaped", () => {
		assert.equal(textToHtml('<script>alert("x")</script> & more'), '<p>&lt;script&gt;alert("x")&lt;/script&gt; &amp; more</p>');
	});

	it("ignores empty blocks", () => {
		assert.equal(textToHtml("  \n\n \n\n"), "");
	});
});

describe("contribution kinds", () => {
	it("has a request key and words for every kind, and doctor kinds are on the doctor track", () => {
		const kinds = Object.keys(KIND_WORDS);
		assert.equal(kinds.length, 8);
		for (const kind of kinds) assert.ok(REQUEST_KEY[kind as keyof typeof REQUEST_KEY], kind);
		assert.deepEqual(
			kinds.filter((k) => KIND_WORDS[k as keyof typeof KIND_WORDS].track === "DOCTOR").sort(),
			["BLOG", "FREE_CONSULTATION", "HOSPITAL_TEST_REVIEW", "MEDICAL_CAMP"]
		);
	});
});

describe("levelLabel", () => {
	it("is the name of the type and the number, for all three types", () => {
		assert.equal(levelLabel("contributor", 3), "Contributor level 3");
		assert.equal(levelLabel("bloodDonor", 10), "Blood Donor level 10");
		assert.equal(levelLabel("healthPartner", 1), "Health Partner level 1");
	});

	it("says there is no level before the first point", () => {
		assert.equal(levelLabel("contributor", 0), "No level yet");
	});
});
