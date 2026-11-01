import { refreshToken } from "@/api/auth";
import { clearAuthTokens, getAuthTokens, saveAuthTokens } from "@/lib/auth";
import { refreshOnce } from "@/lib/bff-proxy";
import { tokenExpired } from "@/lib/token-permissions";

/**
 * The access token to use for the signed-in person, refreshed when it has expired (or when `forceRefresh` says the
 * backend refused it). Undefined when nobody is signed in or the session cannot be renewed (the cookies are then cleared).
 * Server only: the token is read from the httpOnly cookies and is never sent to the browser.
 */
export async function currentAccessToken(forceRefresh = false): Promise<string | undefined> {
	const { accessToken, refreshToken: refresh } = await getAuthTokens();
	if (accessToken && !forceRefresh && !tokenExpired(accessToken)) return accessToken;
	if (!refresh) return undefined;
	const fresh = await refreshOnce(refresh, () => refreshToken(refresh).catch(() => null));
	if (!fresh) {
		await clearAuthTokens();
		return undefined;
	}
	await saveAuthTokens(fresh);
	return fresh.access_token;
}
