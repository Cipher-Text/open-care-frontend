/**
 * Pure helpers of the same-origin proxy (app/api/bff/[...path]/route.ts), kept free of Next imports so they can be tested.
 */

type HeaderReader = { get(name: string): string | null };

const SAFE_METHODS = new Set(["GET", "HEAD"]);
const CLIENT_HEADER = "x-opencare-client";

/** Reads are open to any caller of the proxy; a change must carry the client header (a basic guard against forged cross-site requests). */
export function clientHeaderOk(method: string, headers: HeaderReader): boolean {
	return SAFE_METHODS.has(method.toUpperCase()) || headers.get(CLIENT_HEADER) === "1";
}

/** The backend address for a proxied path; null when a segment could climb out of the API root. */
export function upstreamUrl(apiBase: string, segments: string[], search: string): string | null {
	if (segments.length === 0) return null;
	for (const segment of segments) {
		if (!segment || segment === "." || segment === ".." || segment.includes("/") || segment.includes("\\")) return null;
	}
	return `${apiBase.replace(/\/$/, "")}/${segments.map(encodeURIComponent).join("/")}${search}`;
}

/**
 * What goes to the backend: the body type, language and the caller's address (so the backend's rate limit counts the
 * person, not this server), plus the token. Cookies and the original Authorization header never go on.
 */
export function upstreamHeaders(incoming: HeaderReader, token?: string): Record<string, string> {
	const headers: Record<string, string> = {};
	for (const name of ["content-type", "accept", "accept-language", "user-agent"]) {
		const value = incoming.get(name);
		if (value) headers[name] = value;
	}
	const forwarded = incoming.get("x-forwarded-for") ?? incoming.get("x-real-ip");
	if (forwarded) headers["x-forwarded-for"] = forwarded;
	if (token) headers["authorization"] = `Bearer ${token}`;
	return headers;
}

/** What goes back to the browser: the content, and never a cached copy of a signed-in answer. */
export function downstreamHeaders(upstream: HeaderReader): Record<string, string> {
	const headers: Record<string, string> = { "cache-control": "no-store" };
	for (const name of ["content-type", "content-disposition"]) {
		const value = upstream.get(name);
		if (value) headers[name] = value;
	}
	return headers;
}

const inFlight = new Map<string, Promise<unknown>>();

/**
 * One refresh per refresh token at a time: several requests that find the token expired together share one refresh,
 * because a refresh token may be used only once.
 */
export function refreshOnce<T>(key: string, refresh: () => Promise<T>): Promise<T> {
	const running = inFlight.get(key) as Promise<T> | undefined;
	if (running) return running;
	const started = refresh().finally(() => inFlight.delete(key));
	inFlight.set(key, started);
	return started;
}
