import { displayName } from "./text.ts";

type Place = { name?: string | null; bnName?: string | null } | null | undefined;

const hasBangla = (text: string) => /[\u0980-\u09FF]/.test(text);

/**
 * A record's name in the reader's language. In Bangla the Bangla name leads and the English name follows (and the other
 * way round in English), so both stay findable. A name is never shown twice. The language of each value is read from
 * its letters, not from which field it came from: the imported data sometimes has the Bangla text in `name` and the
 * English text in `bnName`, and a doctor's `bnName` is often a copy of the English name.
 */
export function localizedNames(locale: string, name?: string | null, bnName?: string | null) {
	const values = [displayName(name), displayName(bnName)].filter(Boolean);
	const bn = values.find(hasBangla) ?? "";
	const en = values.find((value) => !hasBangla(value)) ?? "";
	if (locale === "bn" && bn) {
		return { primary: bn, primaryLang: "bn" as const, secondary: en || null, secondaryLang: "en" as const };
	}
	return { primary: en || bn, primaryLang: en ? undefined : ("bn" as const), secondary: en && bn ? bn : null, secondaryLang: "bn" as const };
}

/** A place (district, upazila, union, division) in the reader's language, or "" when there is none. */
export function placeName(locale: string, place: Place): string {
	if (!place) return "";
	const bn = displayName(place.bnName);
	return locale === "bn" && bn ? bn : displayName(place.name);
}

/** An enum value with an English and a Bangla name (hospital type, organization type). */
export function enumName(locale: string, value?: { englishName?: string | null; displayName?: string | null; banglaName?: string | null } | null): string {
	if (!value) return "";
	const bn = value.banglaName?.trim();
	return locale === "bn" && bn ? bn : value.displayName?.trim() || value.englishName?.trim() || "";
}
