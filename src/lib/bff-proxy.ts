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

const IP_LIKE = /^[0-9a-fA-F:.]{3,45}$/;

/**
 * The caller's address as the outermost trusted proxy saw it. `X-Forwarded-For` is a list that each proxy appends to, and
 * the browser may write the first entries itself, so only the entry added by our own proxy is believed: `hops` is how many
 * proxies sit in front of this server (default 1, set with TRUSTED_PROXY_HOPS). With 0 nothing is believed and no address
 * is passed on. Anything that does not look like an address is dropped.
 */
export function clientIp(incoming: HeaderReader, hops = 1): string | undefined {
	if (!Number.isInteger(hops) || hops < 1) return undefined;
	const list = (incoming.get("x-forwarded-for") ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);
	const candidate = list.length > 0 ? list[Math.max(0, list.length - hops)] : incoming.get("x-real-ip")?.trim();
	return candidate && IP_LIKE.test(candidate) ? candidate : undefined;
}

/**
 * What goes to the backend: the body type, language and the caller's address (so the backend's rate limit counts the
 * person, not this server), plus the token. Cookies and the original Authorization header never go on.
 */
export function upstreamHeaders(incoming: HeaderReader, token?: string, hops = 1): Record<string, string> {
	const headers: Record<string, string> = {};
	for (const name of ["content-type", "accept", "accept-language", "user-agent"]) {
		const value = incoming.get(name);
		if (value) headers[name] = value;
	}
	const ip = clientIp(incoming, hops);
	if (ip) headers["x-forwarded-for"] = ip;
	if (token) headers["authorization"] = `Bearer ${token}`;
	return headers;
}

/** How many proxies sit in front of this server, from TRUSTED_PROXY_HOPS (default 1). */
export function trustedProxyHops(value: string | undefined): number {
	if (value === undefined || value.trim() === "") return 1;
	const hops = Number(value);
	return Number.isInteger(hops) && hops >= 0 ? hops : 1;
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

/** How long the backend may take: a file upload gets longer than an ordinary call, and no call may hang for ever. */
export function proxyTimeoutMs(method: string, segments: string[]): number {
	return method.toUpperCase() === "POST" && segments[0] === "files" ? 120_000 : 30_000;
}

/** The backend refused a refresh token (400, 401 or 403): it is used, expired or revoked, and the session is over. */
export function refreshRejected(status: number): boolean {
	return status === 400 || status === 401 || status === 403;
}

/** A refresh failed in a way that says nothing about the session (a timeout, a network error, a 5xx): the cookies stay. */
export class SessionUnavailableError extends Error {
	constructor() {
		super("The session service is unavailable");
	}
}

const inFlight = new Map<string, Promise<unknown>>();

/**
 * One refresh per refresh token: several requests that find the token expired together share one refresh, because a
 * refresh token may be used only once. A successful answer is also kept for `graceMs`, so a request that carried the old
 * cookie and arrives just after the first one finished gets the new tokens instead of a rejection. A failure is not kept.
 */
export function refreshOnce<T>(key: string, refresh: () => Promise<T>, graceMs = 30_000): Promise<T> {
	const running = inFlight.get(key) as Promise<T> | undefined;
	if (running) return running;
	const started = refresh();
	inFlight.set(key, started);
	started.then(
		() => {
			if (graceMs <= 0) {
				inFlight.delete(key);
				return;
			}
			const timer = setTimeout(() => inFlight.delete(key), graceMs);
			if (typeof timer === "object" && "unref" in timer) timer.unref();
		},
		() => inFlight.delete(key)
	);
	return started;
}
