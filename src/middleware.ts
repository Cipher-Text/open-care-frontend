import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { isStaff } from "@/config/navigation-rules";
import { permissionsFromToken, tokenExpired } from "@/lib/token-permissions";

const intlMiddleware = createIntlMiddleware(routing);

/** Routes that are not part of the language scheme: sign-in, account and console (English only, behind a login). */
const NON_LOCALIZED = ["/admin", "/account", "/login", "/signup", "/logout", "/auth"];
const isNonLocalized = (pathname: string) => NON_LOCALIZED.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

/**
 * Public pages go through the language step (English unprefixed, Bangla under /bn); everything else keeps the login rules below.
 *
 * Page-level routing only (what to show), never a substitute for the API's own checks:
 * - /admin and /account need a login;
 * - /admin is the staff console, so someone with no console permission is sent to /account;
 * - signed-in people do not see the login and signup pages.
 */
export function middleware(request: NextRequest) {
	// Server actions (the login itself, the redirect after it, logout) are POSTs to the current page. Redirecting
	// one of them breaks the action ("unexpected response"), and each action does its own checks.
	if (request.headers.has("next-action")) {
		return NextResponse.next();
	}

	const { pathname } = request.nextUrl;
	// Sitemap and robots are metadata routes (a file extension or one of these names), not pages
	if (!isNonLocalized(pathname) && !/^\/(sitemap|robots)/.test(pathname) && !/\.[a-z0-9]+$/i.test(pathname)) {
		return intlMiddleware(request);
	}

	const accessToken = request.cookies.get("access_token")?.value;

	const isConsole = pathname === "/admin" || pathname.startsWith("/admin/");
	const isAccount = pathname === "/account" || pathname.startsWith("/account/");
	const isAuthRoute = ["/login", "/signup"].some((route) => pathname.startsWith(route));

	if ((isConsole || isAccount) && !accessToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (accessToken && (isConsole || isAuthRoute)) {
		const permissions = permissionsFromToken(accessToken);
		const staff = isStaff((permission) => permissions.has(permission));
		// An expired token must not bounce someone away from the login page they need
		if (isAuthRoute) {
			return tokenExpired(accessToken)
				? NextResponse.next()
				: NextResponse.redirect(new URL(staff ? "/admin" : "/account", request.url));
		}
		// Own profile, consents, health and settings are reachable inside the console too, but a person
		// with no console permission belongs in the account area
		if (isConsole && !staff) {
			return NextResponse.redirect(new URL("/account", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)",
	],
};
