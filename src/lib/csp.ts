/**
 * The Content-Security-Policy sent with every page (see next.config.ts).
 *
 * What it stops: the site being framed, plugins, a changed <base>, forms posting to another site, and scripts, fetches or
 * pictures loading from places this site does not use. What it does not stop: a script injected inline, because the pages
 * that Next.js builds ahead of time carry inline bootstrap scripts and the Google Analytics snippet, and a per-request nonce
 * would make every public page render on each visit (the doctor, hospital and blog pages are cached for an hour).
 * Blog HTML is cleaned on the server and structured data is escaped, so no user text reaches a script. Moving to nonces
 * is a later choice, made only if the loss of caching is acceptable.
 */
const GOOGLE_ANALYTICS_SCRIPT = "https://www.googletagmanager.com";
const GOOGLE_ANALYTICS_CONNECT = ["https://www.google-analytics.com", "https://*.google-analytics.com", "https://www.googletagmanager.com"];

export function contentSecurityPolicy(options: { development?: boolean } = {}): string {
	const dev = options.development === true;
	const directives: Record<string, string[]> = {
		"default-src": ["'self'"],
		// 'unsafe-eval' and websockets are only for the development server (hot reload)
		"script-src": ["'self'", "'unsafe-inline'", GOOGLE_ANALYTICS_SCRIPT, ...(dev ? ["'unsafe-eval'"] : [])],
		"style-src": ["'self'", "'unsafe-inline'"],
		// uploaded pictures come from the storage bucket or its CDN, over https (http for a local MinIO in development)
		"img-src": ["'self'", "data:", "blob:", "https:", ...(dev ? ["http:"] : [])],
		"font-src": ["'self'", "data:"],
		"connect-src": ["'self'", ...GOOGLE_ANALYTICS_CONNECT, ...(dev ? ["ws:", "wss:"] : [])],
		"frame-src": ["'none'"],
		"frame-ancestors": ["'none'"],
		"object-src": ["'none'"],
		"base-uri": ["'self'"],
		"form-action": ["'self'"],
		...(dev ? {} : { "upgrade-insecure-requests": [] }),
	};
	return Object.entries(directives)
		.map(([name, values]) => [name, ...values].join(" "))
		.join("; ");
}
