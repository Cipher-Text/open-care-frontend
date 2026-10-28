import { FEATURE_COPY, type ApiPlan, type AudienceCopy, type Tier } from "../config/pricing-plans.ts";

/** Turns the API's plans and the words in `pricing-plans.ts` into what the pricing page shows. Pure, so it is tested without the page. */

export interface PlanView {
	tier: Tier;
	name: string;
	/** Whole BDT; the lowest of `prices` when there are several. */
	price: number;
	/** One price per kind of facility, when a tab covers several and they differ. */
	prices?: { label: string; price: number }[];
	/** "per month", where the API says so. */
	period?: string;
	tagline: string;
	bestFor: string;
	highlight: boolean;
	/** "Everything in Free", for Plus and Pro. */
	includes?: string;
	/** Only what this plan adds over the one below it. */
	features: { text: string; roadmap: boolean }[];
}

export interface AudienceView {
	plans: PlanView[];
	comparison: { label: string; values: string[] }[];
}

const TIERS: Tier[] = ["FREE", "PLUS", "PRO"];
const NAMES: Record<Tier, string> = { FREE: "Free", PLUS: "Plus", PRO: "Pro" };
const FEATURE_ORDER = Object.keys(FEATURE_COPY);

/** Null when the API has no plans for this audience (so the page can say prices are unavailable instead of inventing any). */
export function buildAudienceView(audience: AudienceCopy, plans: ApiPlan[]): AudienceView | null {
	const primary = audience.apiAudiences[0];
	const find = (api: string, tier: Tier) => plans.find((plan) => plan.audience === api && plan.tier === tier);
	const rows = TIERS.map((tier) => find(primary, tier));
	if (rows.some((row) => row === undefined)) return null;
	const primaryPlans = rows as ApiPlan[];

	const known = (plan: ApiPlan) => FEATURE_ORDER.filter((key) => plan.features.includes(key));

	const views: PlanView[] = primaryPlans.map((plan, index) => {
		const copy = audience.tiers[plan.tier];
		const below = index === 0 ? [] : known(primaryPlans[index - 1]);
		const prices = audience.apiAudiences
			.map((api) => ({ label: audience.priceLabels[api] ?? "", price: find(api, plan.tier)?.priceBdt }))
			.filter((entry): entry is { label: string; price: number } => entry.price !== undefined);
		const differs = prices.length > 1 && new Set(prices.map((entry) => entry.price)).size > 1;
		return {
			tier: plan.tier,
			name: NAMES[plan.tier],
			price: Math.min(...prices.map((entry) => entry.price)),
			prices: differs ? prices : undefined,
			period: plan.billingPeriod === "MONTH" && plan.priceBdt > 0 ? "per month" : undefined,
			tagline: copy.tagline,
			bestFor: copy.bestFor,
			highlight: copy.highlight === true,
			includes: index === 0 ? undefined : `Everything in ${NAMES[primaryPlans[index - 1].tier]}`,
			features: known(plan)
				.filter((key) => !below.includes(key))
				.map((key) => ({ text: FEATURE_COPY[key].text, roadmap: FEATURE_COPY[key].roadmap === true })),
		};
	});

	const everyKey = FEATURE_ORDER.filter((key) => primaryPlans.some((plan) => plan.features.includes(key)));
	const comparison = everyKey.map((key) => ({
		label: FEATURE_COPY[key].text,
		values: primaryPlans.map((plan) => (plan.features.includes(key) ? (FEATURE_COPY[key].roadmap ? "Roadmap" : "Yes") : "—")),
	}));

	return { plans: views, comparison };
}
