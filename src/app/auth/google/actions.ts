"use server";

import { getAuthTokens } from "@/lib/auth";
import type { LoginResponse } from "@/types/auth";

/**
 * The signed-in session as the password login returns it, so the page can keep its client-side copy
 * (see saveUserSession). Null when there is no session.
 */
export async function readSessionForClient(): Promise<LoginResponse | null> {
	const { accessToken, refreshToken, tokenType, scope } = await getAuthTokens();
	if (!accessToken || !refreshToken) return null;

	let expiresIn = 300;
	try {
		const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString("utf8")) as { exp?: number };
		if (payload.exp) expiresIn = Math.max(payload.exp - Math.floor(Date.now() / 1000), 0);
	} catch {
		// keep the default
	}
	return { access_token: accessToken, refresh_token: refreshToken, token_type: tokenType ?? "Bearer", expires_in: expiresIn, scope: scope ?? "" };
}
