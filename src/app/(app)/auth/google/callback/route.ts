import { NextRequest, NextResponse } from "next/server";
import { saveAuthTokens } from "@/lib/auth";
import {
	FLOW_COOKIE_PATH,
	STATE_COOKIE,
	VERIFIER_COOKIE,
	appOrigin,
	callbackUri,
	ensureProfile,
	exchangeCode,
	keycloakConfig,
	refreshTokens,
} from "@/lib/google-login";

/** Where Keycloak sends the browser back after Google: finish the sign-in, or return to /login with a reason. */
export async function GET(request: NextRequest) {
	const origin = appOrigin(request.nextUrl.origin);
	const to = (path: string) => {
		const response = NextResponse.redirect(new URL(path, origin));
		response.cookies.delete({ name: VERIFIER_COOKIE, path: FLOW_COOKIE_PATH });
		response.cookies.delete({ name: STATE_COOKIE, path: FLOW_COOKIE_PATH });
		return response;
	};
	const fail = (reason: string) => to(`/login?error=${reason}`);

	const params = request.nextUrl.searchParams;
	if (params.get("error")) return fail(params.get("error") === "access_denied" ? "google_cancelled" : "google_failed");

	const code = params.get("code");
	const state = params.get("state");
	const savedState = request.cookies.get(STATE_COOKIE)?.value;
	const verifier = request.cookies.get(VERIFIER_COOKIE)?.value;
	const config = keycloakConfig();
	if (!config || !code || !state || !savedState || state !== savedState || !verifier) return fail("google_failed");

	let tokens = await exchangeCode(config, code, verifier, callbackUri(origin)).catch(() => null);
	if (!tokens) return fail("google_failed");

	const ensured = await ensureProfile(tokens.access_token).catch(() => ({ status: "failed" as const, rolesChanged: false }));
	if (ensured.status === "email_in_use") return fail("google_email_in_use");
	if (ensured.status === "email_unverified") return fail("google_email_unverified");
	if (ensured.status !== "ok") return fail("google_failed");

	// The token was issued before the user was put in their group, so it has no roles: get a fresh one
	if (ensured.rolesChanged) {
		const refreshed = await refreshTokens(config, tokens.refresh_token).catch(() => null);
		if (refreshed) tokens = refreshed;
	}

	await saveAuthTokens(tokens);
	return to("/auth/google/done");
}
