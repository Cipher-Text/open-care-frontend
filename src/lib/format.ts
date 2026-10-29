/** Locale for Intl: Bangla gets Bangla digits and month names, English keeps the current style. */
export const intlLocale = (locale: string) => (locale === "bn" ? "bn-BD" : "en-US");

export const formatNumber = (n: number, locale = "en") => new Intl.NumberFormat(intlLocale(locale)).format(n);

/** A calendar date as stored (the API sends a date-time with no zone), so the server and the browser agree. */
export function formatDate(value: string | null | undefined, locale = "en"): string | null {
	if (!value) return null;
	return new Date(`${value.slice(0, 10)}T00:00:00Z`).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});
}
