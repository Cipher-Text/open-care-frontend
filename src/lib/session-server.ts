import { RefreshFailedError, refreshToken } from "@/api/auth";
import { clearAuthTokens, getAuthTokens, saveAuthTokens } from "@/lib/auth";
import { refreshOnce, refreshRejected, SessionUnavailableError } from "@/lib/bff-proxy";
import { tokenExpired } from "@/lib/token-permissions";

/**
 * The access token to use for the signed-in person, refreshed when it has expired (or when `forceRefresh` says the
 * backend refused it). Undefined when nobody is signed in or the backend refused the refresh token (the cookies are then
 * cleared). When the refresh fails for another reason (timeout, network, 5xx) the cookies are kept and a
 * `SessionUnavailableError` is thrown, so a short outage does not sign anyone out.
 * Server only: the token is read from the httpOnly cookies and is never sent to the browser.
 */
export async function currentAccessToken(forceRefresh = false): Promise<string | undefined> {
	const { accessToken, refreshToken: refresh } = await getAuthTokens();
	if (accessToken && !forceRefresh && !tokenExpired(accessToken)) return accessToken;
	if (!refresh) return undefined;
	let fresh;
	try {
		fresh = await refreshOnce(refresh, () => refreshToken(refresh));
	} catch (error) {
		if (error instanceof RefreshFailedError && refreshRejected(error.status)) {
			await clearAuthTokens();
			return undefined;
		}
		throw new SessionUnavailableError();
	}
	await saveAuthTokens(fresh);
	return fresh.access_token;
}
