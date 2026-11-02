/**
 * Pure rules of the "Your details" form on the profile page, kept free of React so they can be tested. The backend checks
 * the same things again (`ProfileDetailsRequest`); these checks only save a round trip and say what is wrong in plain words.
 */

export interface DetailsForm {
	name: string;
	bnName: string;
	phone: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	districtId: string;
	upazilaId: string;
	unionId: string;
}

export interface DetailsPayload {
	name: string;
	bnName: string | null;
	phone: string | null;
	dateOfBirth: string | null;
	gender: string | null;
	address: string | null;
	districtId: number | null;
	upazilaId: number | null;
	unionId: number | null;
}

export type Built = { ok: true; payload: DetailsPayload } | { ok: false; errors: string[] };

/** What the profile holds, as far as the form needs. */
export interface ProfileLike {
	name?: string | null;
	bnName?: string | null;
	phone?: string | null;
	dateOfBirth?: string | null;
	gender?: { value: string } | null;
	address?: string | null;
	district?: { id: number } | null;
	upazila?: { id: number } | null;
	union?: { id: number } | null;
}

const PHONE = /^\+?[0-9]{10,15}$/;

export function fromProfile(p: ProfileLike): DetailsForm {
	return {
		name: p.name ?? "",
		bnName: p.bnName ?? "",
		phone: p.phone ?? "",
		dateOfBirth: (p.dateOfBirth ?? "").slice(0, 10),
		gender: p.gender?.value ?? "",
		address: p.address ?? "",
		districtId: p.district ? String(p.district.id) : "",
		upazilaId: p.upazila ? String(p.upazila.id) : "",
		unionId: p.union ? String(p.union.id) : "",
	};
}

const orNull = (text: string) => (text.trim() === "" ? null : text.trim());
const idOrNull = (text: string) => (text === "" ? null : Number(text));

/** Today as YYYY-MM-DD in the browser's own time zone. */
function today(now: Date): string {
	return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function buildDetails(form: DetailsForm, now: Date = new Date()): Built {
	const errors: string[] = [];
	const name = form.name.trim();
	if (name.length < 2) errors.push("Name must be at least 2 characters.");
	if (name.length > 200) errors.push("Name must be at most 200 characters.");
	if (form.bnName.trim().length > 200) errors.push("Bangla name must be at most 200 characters.");
	const phone = form.phone.replace(/[\s-]/g, "");
	if (phone !== "" && !PHONE.test(phone)) errors.push("Phone must be 10 to 15 digits, with an optional leading +.");
	if (form.dateOfBirth) {
		if (form.dateOfBirth > today(now)) errors.push("Date of birth cannot be in the future.");
		else if (form.dateOfBirth < "1900-01-01") errors.push("Date of birth looks wrong.");
	}
	if (form.address.trim().length > 500) errors.push("Address must be at most 500 characters.");
	if (form.upazilaId && !form.districtId) errors.push("Choose the district before the upazila.");
	if (form.unionId && !form.upazilaId) errors.push("Choose the upazila before the union.");
	if (errors.length > 0) return { ok: false, errors };
	return {
		ok: true,
		payload: {
			name,
			bnName: orNull(form.bnName),
			phone: phone === "" ? null : phone,
			dateOfBirth: orNull(form.dateOfBirth),
			gender: orNull(form.gender),
			address: orNull(form.address),
			districtId: idOrNull(form.districtId),
			upazilaId: idOrNull(form.upazilaId),
			unionId: idOrNull(form.unionId),
		},
	};
}

/** True when the form differs from what the profile holds, so Save is offered only when there is something to save. */
export function changed(form: DetailsForm, p: ProfileLike): boolean {
	const original = fromProfile(p);
	return (Object.keys(original) as (keyof DetailsForm)[]).some((key) => original[key] !== form[key]);
}
