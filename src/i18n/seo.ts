import type { Metadata } from "next";
import type { Locale } from "./routing";

/**
 * Canonical and language alternates for a page that exists in both languages. English is the address without a prefix
 * and is the x-default. `path` is the English path ("" for the home page, "/blog", "/blog/some-slug").
 * Pages that are not translated yet get no alternates: the layout marks their /bn copy noindex.
 */
export function bilingual(locale: Locale, path: string): Pick<Metadata, "alternates" | "robots"> {
	const en = path || "/";
	const bn = `/bn${path}`;
	return {
		alternates: { canonical: locale === "bn" ? bn : en, languages: { en, bn, "x-default": en } },
		robots: { index: true, follow: true },
	};
}
