const ALLOWED = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Only http(s), mailto and tel links are rendered; anything else (javascript:, data:) is dropped. A bare domain gets https://. */
export function safeUrl(url?: string | null): string | null {
	const value = url?.trim();
	if (!value) return null;
	// A scheme is letters then ":" not followed by a digit, so "example.com:8080" still reads as a bare domain
	const hasScheme = /^[a-z][a-z0-9+.-]*:(?!\d)/i.test(value);
	const candidate = hasScheme ? value : `https://${value}`;
	try {
		const parsed = new URL(candidate);
		return ALLOWED.has(parsed.protocol) ? parsed.toString() : null;
	} catch {
		return null;
	}
}
