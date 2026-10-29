import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { baseUrl } from "@/config/config";
import { siteUrl } from "@/lib/site";
import type { LoginResponse } from "@/types/auth";

/**
 * Sign in with Google goes through Keycloak (the "google" identity provider of the realm): the browser is sent to
 * Keycloak with kc_idp_hint=google, Keycloak signs the person in with Google, and comes back to /auth/google/callback
 * with a one-time code. The code is exchanged here, on the server, using PKCE, so no client secret is involved.
 */

export const VERIFIER_COOKIE = "oc_google_verifier";
export const STATE_COOKIE = "oc_google_state";
export const FLOW_COOKIE_PATH = "/auth/google";
export const FLOW_COOKIE_MAX_AGE = 10 * 60;

export interface KeycloakConfig {
	url: string;
	realm: string;
	clientId: string;
}

/** Null when the deployment has not been set up for Google sign-in (KEYCLOAK_URL and KEYCLOAK_REALM). */
export function keycloakConfig(): KeycloakConfig | null {
	const url = process.env.KEYCLOAK_URL?.trim().replace(/\/$/, "");
	const realm = process.env.KEYCLOAK_REALM?.trim();
	if (!url || !realm) return null;
	return { url, realm, clientId: process.env.KEYCLOAK_CLIENT_ID?.trim() || "open-care-frontend" };
}

/** The public address of the app: NEXT_PUBLIC_SITE_URL when set, otherwise the one the request came to. */
export function appOrigin(requestOrigin: string): string {
	return process.env.NEXT_PUBLIC_SITE_URL ? siteUrl : requestOrigin;
}

export const callbackUri = (origin: string) => `${origin}/auth/google/callback`;

export function newPkce() {
	const verifier = randomBytes(48).toString("base64url");
	const challenge = createHash("sha256").update(verifier).digest("base64url");
	return { verifier, challenge };
}

export const newState = () => randomBytes(16).toString("hex");

export function authorizeUrl(config: KeycloakConfig, params: { redirectUri: string; state: string; challenge: string }): string {
	const url = new URL(`${config.url}/realms/${config.realm}/protocol/openid-connect/auth`);
	url.search = new URLSearchParams({
		client_id: config.clientId,
		response_type: "code",
		scope: "openid email profile",
		redirect_uri: params.redirectUri,
		state: params.state,
		code_challenge: params.challenge,
		code_challenge_method: "S256",
		kc_idp_hint: "google",
	}).toString();
	return url.toString();
}

async function tokenRequest(config: KeycloakConfig, form: Record<string, string>): Promise<LoginResponse | null> {
	const response = await fetch(`${config.url}/realms/${config.realm}/protocol/openid-connect/token`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ client_id: config.clientId, ...form }),
		cache: "no-store",
	});
	return response.ok ? ((await response.json()) as LoginResponse) : null;
}

export const exchangeCode = (config: KeycloakConfig, code: string, verifier: string, redirectUri: string) =>
	tokenRequest(config, { grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: redirectUri });

export const refreshTokens = (config: KeycloakConfig, refreshToken: string) =>
	tokenRequest(config, { grant_type: "refresh_token", refresh_token: refreshToken });

export interface EnsureResult {
	status: "ok" | "email_in_use" | "email_unverified" | "failed";
	rolesChanged: boolean;
}

/** First sign-in: the backend creates the profile and puts the user in the standard group. */
export async function ensureProfile(accessToken: string): Promise<EnsureResult> {
	const response = await fetch(`${baseUrl}/profiles/self/ensure`, {
		method: "POST",
		headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
		cache: "no-store",
	});
	if (response.status === 409) return { status: "email_in_use", rolesChanged: false };
	if (response.status === 400) return { status: "email_unverified", rolesChanged: false };
	if (!response.ok) return { status: "failed", rolesChanged: false };
	const body = (await response.json()) as { rolesChanged?: boolean };
	return { status: "ok", rolesChanged: body.rolesChanged === true };
}
