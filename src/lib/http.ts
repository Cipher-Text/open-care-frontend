/** How long a call to the backend or Keycloak may take before the web server gives up on it (a hung call would hold the page for ever). */
export const DEFAULT_TIMEOUT_MS = 10_000;

/** `fetch` with a time limit; a caller-supplied `signal` wins. The call rejects with a TimeoutError when the limit passes. */
export function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<Response> {
	return fetch(input, { ...init, signal: init.signal ?? AbortSignal.timeout(timeoutMs) });
}
