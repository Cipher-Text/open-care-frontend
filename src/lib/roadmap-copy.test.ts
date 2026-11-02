import assert from "node:assert/strict";
import test from "node:test";
import { FEATURE_COPY } from "../config/pricing-plans.ts";
import { buildAudienceView, priceLabel } from "./pricing-view.ts";
import { AUDIENCES, type ApiPlan } from "../config/pricing-plans.ts";

// Features with no code behind them (checked against the code on November 2, 2026) must say so on the pricing page.
const UNBUILT = ["WHATSAPP_BOOKING_LINK", "QR_VCARD", "REVIEWS_FAQ", "FEATURED_DOCTORS", "ACCREDITATION_BADGES", "STATS_HIGHLIGHTS", "REPORT_STORAGE", "REPORT_ANALYSIS", "FAMILY_SHARING", "SEARCH_PRIORITY", "FACEBOOK_HIGHLIGHT", "DASHBOARD_WIDGETS", "VIDEO_CONSULTATION_MEMBER_RATE", "SMS_EMAIL_NOTIFICATIONS"];
// Built, so they are not marked roadmap
const BUILT = ["PRESCRIPTIONS", "PRACTICE_DASHBOARD", "TEST_PRICE_LIST", "ENQUIRY_ANALYTICS", "BLOOD_DONOR_LIST", "CONTACT_VERIFICATION", "HEALTH_VITALS", "CONSENT_MANAGEMENT"];

test("a feature that is not built is marked roadmap, and a built one is not", () => {
	for (const key of UNBUILT) assert.equal(FEATURE_COPY[key]?.roadmap, true, `${key} should be marked roadmap`);
	for (const key of BUILT) assert.notEqual(FEATURE_COPY[key]?.roadmap, true, `${key} is built and should not be marked roadmap`);
});

test("until the prices are decided a paid plan says so and Free says Free", () => {
	assert.equal(priceLabel(0, false), "Free");
	assert.equal(priceLabel(1000, false), "To be announced");
	assert.equal(priceLabel(0, true), "BDT 0");
	assert.equal(priceLabel(1000, true), "BDT 1,000");
});

test("reviews are not listed as something a plan sells", () => {
	assert.ok(!/review/i.test(FEATURE_COPY.REVIEWS_FAQ.text));
	const plan = (tier: ApiPlan["tier"], features: string[]): ApiPlan => ({ audience: "DOCTOR", tier, priceBdt: 0, billingPeriod: null, features });
	const view = buildAudienceView(AUDIENCES.find((a) => a.id === "doctors")!, [plan("FREE", []), plan("PLUS", ["REVIEWS_FAQ"]), plan("PRO", ["REVIEWS_FAQ"])])!;
	assert.ok(view.plans[1].features.every((f) => !/review/i.test(f.text)));
});
