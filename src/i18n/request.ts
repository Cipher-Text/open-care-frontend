import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
	// English is the base: a Bangla message that does not exist yet falls back to the English text
	const english = (await import("../messages/en.json")).default;
	const messages = locale === "en" ? english : mergeMessages(english, (await import(`../messages/${locale}.json`)).default);
	return { locale, messages };
});

type Tree = { [key: string]: string | Tree };

function mergeMessages(base: Tree, override: Tree): Tree {
	const result: Tree = { ...base };
	for (const [key, value] of Object.entries(override)) {
		const current = result[key];
		result[key] = typeof value === "object" && typeof current === "object" ? mergeMessages(current, value) : value;
	}
	return result;
}
