import assert from "node:assert/strict";
import test from "node:test";
import { buildSocial, fromSocial, socialChanged } from "./social-links.ts";

test("empty fields stay empty and are sent as empty strings so a cleared link is cleared", () => {
	const built = buildSocial(fromSocial({}));
	assert.equal(built.ok, true);
	if (built.ok) assert.deepEqual(built.payload, { facebookProfileUrl: "", linkedinProfileUrl: "", researchGateProfileUrl: "", xprofileUrl: "" });
});

test("a bare domain gets https and an unsafe address is refused", () => {
	const ok = buildSocial({ ...fromSocial({}), linkedinProfileUrl: "linkedin.com/in/rahim" });
	assert.equal(ok.ok, true);
	if (ok.ok) assert.equal(ok.payload.linkedinProfileUrl, "https://linkedin.com/in/rahim");
	const bad = buildSocial({ ...fromSocial({}), xprofileUrl: "javascript:alert(1)" });
	assert.equal(bad.ok, false);
	const mail = buildSocial({ ...fromSocial({}), xprofileUrl: "mailto:a@b.com" });
	assert.equal(mail.ok, false);
});

test("changed is true only when a link differs", () => {
	const p = { facebookProfileUrl: "https://facebook.com/a" };
	assert.equal(socialChanged(fromSocial(p), p), false);
	assert.equal(socialChanged({ ...fromSocial(p), xprofileUrl: "x.com/a" }, p), true);
});
