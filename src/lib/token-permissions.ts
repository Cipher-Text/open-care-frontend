/**
 * Permissions carried by an access token, readable on the client, in server actions and in the middleware
 * (it only needs atob). Reading a token here is for deciding what to show; the API still checks every call.
 */

type Payload = {
	permissions?: unknown;
	authorities?: unknown;
	scope?: unknown;
	realm_access?: { roles?: unknown };
};

const strings = (value: unknown): string[] =>
	Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];

function decode(token: string): Payload | null {
	const part = token.split(".")[1];
	if (!part) return null;
	try {
		const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
		const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
		const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
		return JSON.parse(new TextDecoder().decode(bytes)) as Payload;
	} catch {
		return null;
	}
}

/** The realm roles in the token are the permissions (and the user type) the backend granted. */
export function permissionsFromToken(token?: string | null): Set<string> {
	const result = new Set<string>();
	const payload = token ? decode(token) : null;
	if (!payload) return result;
	const add = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		result.add(trimmed);
		result.add(trimmed.replace(/_/g, "-"));
	};
	strings(payload.realm_access?.roles).forEach(add);
	strings(payload.permissions).forEach(add);
	strings(payload.authorities).forEach(add);
	if (typeof payload.scope === "string") payload.scope.split(" ").forEach(add);
	return result;
}

export function tokenExpired(token?: string | null): boolean {
	const payload = token ? (decode(token) as { exp?: number } | null) : null;
	return !payload || typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now();
}
