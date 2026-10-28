import assert from "node:assert/strict";
import { test } from "node:test";
import { AUDIENCES, type ApiPlan } from "../config/pricing-plans.ts";
import { buildAudienceView } from "./pricing-view.ts";

// Run with: npm run test:pricing
const plan = (audience: ApiPlan["audience"], tier: ApiPlan["tier"], priceBdt: number, features: string[], billingPeriod: string | null = null): ApiPlan => ({
	audience, tier, priceBdt, billingPeriod, features,
});
const audience = (id: string) => AUDIENCES.find((a) => a.id === id)!;

const doctorPlans = [
	plan("DOCTOR", "FREE", 0, ["DIRECTORY_LISTING", "PRESCRIPTIONS"]),
	plan("DOCTOR", "PLUS", 1000, ["DIRECTORY_LISTING", "PRESCRIPTIONS", "WHATSAPP_BOOKING_LINK", "SMS_EMAIL_NOTIFICATIONS"]),
	plan("DOCTOR", "PRO", 2000, ["DIRECTORY_LISTING", "PRESCRIPTIONS", "WHATSAPP_BOOKING_LINK", "SMS_EMAIL_NOTIFICATIONS", "SEARCH_PRIORITY"]),
];

test("each plan lists only what it adds, and says what it includes", () => {
	const view = buildAudienceView(audience("doctors"), doctorPlans)!;
	assert.deepEqual(view.plans.map((p) => p.name), ["Free", "Plus", "Pro"]);
	assert.equal(view.plans[0].includes, undefined);
	assert.equal(view.plans[1].includes, "Everything in Free");
	assert.deepEqual(view.plans[1].features.map((f) => f.text), [
		"WhatsApp pre-filled booking link",
		"SMS and email notifications (follow-up reminders and enquiry alerts)",
	]);
	assert.deepEqual(view.plans[2].features.map((f) => f.text), ["Priority placement in public search, clearly labelled as featured"]);
});

test("prices come from the API", () => {
	const view = buildAudienceView(audience("doctors"), doctorPlans)!;
	assert.deepEqual(view.plans.map((p) => p.price), [0, 1000, 2000]);
});

test("features not built yet are marked roadmap, the others are not", () => {
	const view = buildAudienceView(audience("doctors"), doctorPlans)!;
	assert.equal(view.plans[0].features.find((f) => f.text.startsWith("Write prescriptions"))?.roadmap, false);
	assert.equal(view.plans[2].features[0].roadmap, true);
});

test("the comparison table says Yes, Roadmap or a dash", () => {
	const row = (label: string) => buildAudienceView(audience("doctors"), doctorPlans)!.comparison.find((r) => r.label.startsWith(label))!.values;
	assert.deepEqual(row("WhatsApp"), ["—", "Yes", "Yes"]);
	assert.deepEqual(row("Priority placement"), ["—", "—", "Roadmap"]);
});

test("hospitals show a clinic price and a hospital price when they differ", () => {
	const plans = [
		plan("CLINIC", "FREE", 0, ["DIRECTORY_LISTING"]), plan("HOSPITAL", "FREE", 0, ["DIRECTORY_LISTING"]),
		plan("CLINIC", "PLUS", 1500, ["DIRECTORY_LISTING", "LANDING_PAGE"]), plan("HOSPITAL", "PLUS", 3000, ["DIRECTORY_LISTING", "LANDING_PAGE"]),
		plan("CLINIC", "PRO", 3000, ["DIRECTORY_LISTING", "LANDING_PAGE"]), plan("HOSPITAL", "PRO", 5000, ["DIRECTORY_LISTING", "LANDING_PAGE"]),
	];
	const view = buildAudienceView(audience("hospitals"), plans)!;
	assert.equal(view.plans[0].prices, undefined);
	assert.deepEqual(view.plans[1].prices, [
		{ label: "Clinics and diagnostic centres", price: 1500 },
		{ label: "Hospitals", price: 3000 },
	]);
	assert.equal(view.plans[1].price, 1500);
});

test("the patient period comes from the API and never appears on Free", () => {
	const plans = [plan("PATIENT", "FREE", 0, [], "MONTH"), plan("PATIENT", "PLUS", 250, [], "MONTH"), plan("PATIENT", "PRO", 500, [], "MONTH")];
	const view = buildAudienceView(audience("patients"), plans)!;
	assert.deepEqual(view.plans.map((p) => p.period), [undefined, "per month", "per month"]);
});

test("no plans from the API means no view, so the page shows no made-up prices", () => {
	assert.equal(buildAudienceView(audience("doctors"), []), null);
	assert.equal(buildAudienceView(audience("doctors"), doctorPlans.slice(0, 2)), null);
});

test("a feature key the page has no words for is left out", () => {
	const plans = [plan("DOCTOR", "FREE", 0, ["DIRECTORY_LISTING", "SOMETHING_NEW"]), doctorPlans[1], doctorPlans[2]];
	const text = buildAudienceView(audience("doctors"), plans)!.plans[0].features.map((f) => f.text);
	assert.deepEqual(text, ["Listing in the Open Care directory"]);
});
