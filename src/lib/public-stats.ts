import { baseUrl } from "@/config/config";
import { formatNumber } from "@/lib/format";
import { displayName } from "@/lib/text";

/**
 * Live numbers for the public home page, fetched on the server and cached for an hour by Next
 * (so visitors never trigger these calls and the backend rate limit is not involved).
 * Everything degrades to "unknown" when the API is unreachable: the page then hides the
 * numbers instead of showing made-up ones.
 */

const REVALIDATE_SECONDS = 60 * 60;

export interface FacilityTypeStat {
	value: string;
	/** Key of home.types.names in the message files. */
	label: string;
	count: number | null;
}

export interface DivisionGroup {
	id: number;
	name: string;
	districts: { id: number; name: string }[];
}

export interface HomeStats {
	facilities: number | null;
	doctors: number | null;
	districts: number | null;
	/** Every district (alphabetical), used by the search box. */
	districtList: { id: number; name: string }[];
	upazilas: number | null;
	types: FacilityTypeStat[];
	divisions: DivisionGroup[];
}

/** The facility types worth featuring, keyed by the API's English name; `label` is a key of home.types.names. */
const FEATURED_TYPES: { apiName: string; label: string }[] = [
	{ apiName: "Community Clinic", label: "community" },
	{ apiName: "Consultancy & Diagnostic Center", label: "diagnostic" },
	{ apiName: "Private Hospital or Clinic", label: "private" },
	{ apiName: "Union Health Center", label: "union" },
	{ apiName: "Upazila Health Complex", label: "upazila" },
	{ apiName: "NGO Hospital or Clinic", label: "ngo" },
	{ apiName: "Blood Bank", label: "blood" },
];

async function getJson<T>(path: string): Promise<T | null> {
	try {
		const res = await fetch(`${baseUrl}${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
		return res.ok ? ((await res.json()) as T) : null;
	} catch {
		return null;
	}
}

async function total(path: string): Promise<number | null> {
	const page = await getJson<{ totalItems?: number }>(path);
	return typeof page?.totalItems === "number" ? page.totalItems : null;
}

interface RawType {
	value: string;
	englishName: string;
}
interface RawDistrict {
	id: number;
	name: string;
	bnName?: string | null;
	division?: { id: number; name: string; bnName?: string | null };
}

/** The seed data has a placeholder district and division called "Not Available"; hide them. */
const isPlaceholder = (name: string) => /^\s*(not\s*available|n\/?a)\s*$/i.test(name);

/** Numbers and place names for the home page; place names are in Bangla for `bn` where the data has them. */
export async function getHomeStats(locale = "en"): Promise<HomeStats> {
	const bn = locale === "bn";
	const pick = (en: string, bnName?: string | null) => (bn && bnName?.trim() ? displayName(bnName) : en);
	const compare = (a: string, b: string) => a.localeCompare(b, bn ? "bn" : "en");
	const [facilities, doctors, rawTypes, rawDistricts, upazilas] = await Promise.all([
		total("/hospitals?size=1"),
		total("/doctors?size=1"),
		getJson<RawType[]>("/hospital-types"),
		getJson<RawDistrict[]>("/districts"),
		getJson<unknown[]>("/upazilas"),
	]);

	const featured = FEATURED_TYPES.flatMap((f) => {
		const found = rawTypes?.find((t) => t.englishName === f.apiName);
		return found ? [{ value: found.value, label: f.label }] : [];
	});
	const counts = await Promise.all(
		featured.map((t) => total(`/hospitals?size=1&hospitalTypes=${encodeURIComponent(t.value)}`))
	);
	const types = featured
		.map((t, i) => ({ ...t, count: counts[i] }))
		.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

	const realDistricts = (rawDistricts ?? []).filter((d) => !isPlaceholder(d.name));
	const byDivision = new Map<number, DivisionGroup>();
	realDistricts.forEach((d) => {
		if (!d.division) return;
		const group = byDivision.get(d.division.id) ?? { id: d.division.id, name: pick(d.division.name, d.division.bnName), districts: [] };
		group.districts.push({ id: d.id, name: pick(d.name, d.bnName) });
		byDivision.set(d.division.id, group);
	});
	const divisions = [...byDivision.values()]
		.filter((g) => !isPlaceholder(g.name))
		.map((g) => ({ ...g, districts: g.districts.sort((a, b) => compare(a.name, b.name)) }))
		.sort((a, b) => compare(a.name, b.name));

	return {
		facilities,
		doctors,
		districts: rawDistricts ? realDistricts.length : null,
		districtList: realDistricts
			.map((d) => ({ id: d.id, name: pick(d.name, d.bnName) }))
			.sort((a, b) => compare(a.name, b.name)),
		upazilas: Array.isArray(upazilas) ? upazilas.length : null,
		types,
		divisions,
	};
}

export const formatCount = (n: number, locale = "en") => formatNumber(n, locale);
