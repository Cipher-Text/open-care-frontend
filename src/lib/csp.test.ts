import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apiOrigin, contentSecurityPolicy } from "./csp.ts";

const directive = (policy: string, name: string) => policy.split("; ").find((d) => d.startsWith(`${name} `) || d === name);

describe("content security policy", () => {
	const production = contentSecurityPolicy();

	it("never lets the site be framed, embed plugins or change its base", () => {
		assert.equal(directive(production, "frame-ancestors"), "frame-ancestors 'none'");
		assert.equal(directive(production, "object-src"), "object-src 'none'");
		assert.equal(directive(production, "base-uri"), "base-uri 'self'");
		assert.equal(directive(production, "form-action"), "form-action 'self'");
	});

	it("allows scripts and fetches only from the site and Google Analytics", () => {
		assert.match(directive(production, "script-src")!, /^script-src 'self' 'unsafe-inline' https:\/\/www\.googletagmanager\.com$/);
		assert.ok(!directive(production, "connect-src")!.includes("ws:"));
		assert.ok(!production.includes("'unsafe-eval'"));
		assert.ok(production.includes("upgrade-insecure-requests"));
	});

	it("opens eval, websockets and http pictures only for development", () => {
		const dev = contentSecurityPolicy({ development: true });
		assert.ok(directive(dev, "script-src")!.includes("'unsafe-eval'"));
		assert.ok(directive(dev, "connect-src")!.includes("ws:"));
		assert.ok(directive(dev, "img-src")!.includes("http:"));
		assert.ok(!dev.includes("upgrade-insecure-requests"));
	});

	it("allows the backend address for fetches, and only its origin", () => {
		const policy = contentSecurityPolicy({ apiBaseUrl: "https://api.opencarebd.com/api" });
		assert.ok(directive(policy, "connect-src")!.includes("https://api.opencarebd.com"));
		assert.ok(!directive(policy, "connect-src")!.includes("opencarebd.com/api"));
		assert.equal(apiOrigin("not a url"), null);
		assert.equal(apiOrigin(undefined), null);
		assert.ok(!directive(contentSecurityPolicy(), "connect-src")!.includes("http://localhost"));
	});
});
