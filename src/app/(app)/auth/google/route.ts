import { NextRequest, NextResponse } from "next/server";
import {
	FLOW_COOKIE_MAX_AGE,
	FLOW_COOKIE_PATH,
	STATE_COOKIE,
	VERIFIER_COOKIE,
	appOrigin,
	authorizeUrl,
	callbackUri,
	keycloakConfig,
	newPkce,
	newState,
} from "@/lib/google-login";

/** Starts "Continue with Google": remembers a PKCE verifier and a state, then sends the browser to Keycloak. */
export function GET(request: NextRequest) {
	const origin = appOrigin(request.nextUrl.origin);
	const config = keycloakConfig();
	if (!config) return NextResponse.redirect(new URL("/login?error=google_not_configured", origin));

	const { verifier, challenge } = newPkce();
	const state = newState();
	const response = NextResponse.redirect(authorizeUrl(config, { redirectUri: callbackUri(origin), state, challenge }));
	const cookie = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: FLOW_COOKIE_PATH,
		maxAge: FLOW_COOKIE_MAX_AGE,
	};
	response.cookies.set(VERIFIER_COOKIE, verifier, cookie);
	response.cookies.set(STATE_COOKIE, state, cookie);
	return response;
}
