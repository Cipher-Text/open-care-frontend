/**
 * Pure rules of the "Social links" form on the profile page, free of React so they can be tested. The backend accepts these
 * four links on PUT /profiles/self; a link that is cleared is sent as an empty string, because the server leaves a null alone.
 */
import { safeUrl } from "./safe-url.ts";

export const SOCIAL_FIELDS = [
	{ key: "facebookProfileUrl", label: "Facebook" },
	{ key: "linkedinProfileUrl", label: "LinkedIn" },
	{ key: "researchGateProfileUrl", label: "ResearchGate" },
	{ key: "xprofileUrl", label: "X (Twitter)" },
] as const;

export type SocialKey = (typeof SOCIAL_FIELDS)[number]["key"];
export type SocialForm = Record<SocialKey, string>;
export type SocialLike = Partial<Record<SocialKey, string | null>>;

export function fromSocial(p: SocialLike): SocialForm {
	return {
		facebookProfileUrl: p.facebookProfileUrl ?? "",
		linkedinProfileUrl: p.linkedinProfileUrl ?? "",
		researchGateProfileUrl: p.researchGateProfileUrl ?? "",
		xprofileUrl: p.xprofileUrl ?? "",
	};
}

export type SocialBuilt = { ok: true; payload: SocialForm } | { ok: false; errors: string[] };

export function buildSocial(form: SocialForm): SocialBuilt {
	const errors: string[] = [];
	const payload = fromSocial({});
	for (const { key, label } of SOCIAL_FIELDS) {
		const value = form[key].trim();
		if (value === "") continue;
		if (value.length > 500) errors.push(`${label}: the link is too long.`);
		const safe = safeUrl(value);
		if (!safe || !/^https?:/i.test(safe)) errors.push(`${label}: enter a web address that starts with http or https.`);
		else payload[key] = safe;
	}
	return errors.length > 0 ? { ok: false, errors } : { ok: true, payload };
}

export function socialChanged(form: SocialForm, p: SocialLike): boolean {
	const original = fromSocial(p);
	return SOCIAL_FIELDS.some(({ key }) => original[key] !== form[key].trim());
}
