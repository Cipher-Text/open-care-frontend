import { defineRouting } from "next-intl/routing";

/**
 * English is served at the current URLs and Bangla under /bn, for the public pages only. The sign-in, account and
 * console routes are not part of this (see src/middleware.ts). No cookie and no redirect by browser language: the URL
 * alone says which language a page is in, so public pages stay cacheable and each language is its own page for search.
 */
export const routing = defineRouting({
	locales: ["en", "bn"],
	defaultLocale: "en",
	localePrefix: "as-needed",
	localeDetection: false,
	localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const isLocale = (value: string): value is Locale => (routing.locales as readonly string[]).includes(value);
