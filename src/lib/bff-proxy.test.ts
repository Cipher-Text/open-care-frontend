import assert from "node:assert/strict";
import test from "node:test";
import { clientHeaderOk, clientIp, downstreamHeaders, proxyTimeoutMs, refreshOnce, refreshRejected, trustedProxyHops, upstreamHeaders, upstreamUrl } from "./bff-proxy.ts";

const headers = (entries: Record<string, string>) => ({ get: (name: string) => entries[name.toLowerCase()] ?? null });

test("a read needs no client header, a change does", () => {
	assert.equal(clientHeaderOk("GET", headers({})), true);
	assert.equal(clientHeaderOk("POST", headers({})), false);
	assert.equal(clientHeaderOk("delete", headers({})), false);
	assert.equal(clientHeaderOk("PUT", headers({ "x-opencare-client": "1" })), true);
	assert.equal(clientHeaderOk("PUT", headers({ "x-opencare-client": "0" })), false);
});

test("the backend address keeps the query and refuses a path that climbs out", () => {
	assert.equal(upstreamUrl("http://api/api/", ["hospitals", "12"], "?size=5"), "http://api/api/hospitals/12?size=5");
	assert.equal(upstreamUrl("http://api/api", ["a b", "c"], ""), "http://api/api/a%20b/c");
	assert.equal(upstreamUrl("http://api/api", ["..", "admin"], ""), null);
	assert.equal(upstreamUrl("http://api/api", ["a/b"], ""), null);
	assert.equal(upstreamUrl("http://api/api", ["a\\b"], ""), null);
	assert.equal(upstreamUrl("http://api/api", [], ""), null);
});

test("the backend gets the body type and the caller's address and the token, and never the cookie or an Authorization the browser wrote", () => {
	const sent = upstreamHeaders(
		headers({ "content-type": "application/json", cookie: "access_token=secret", authorization: "Bearer forged", "x-forwarded-for": "203.0.113.9", "user-agent": "UA" }),
		"real-token"
	);
	assert.deepEqual(sent, { "content-type": "application/json", "user-agent": "UA", "x-forwarded-for": "203.0.113.9", authorization: "Bearer real-token" });
	assert.equal(upstreamHeaders(headers({ authorization: "Bearer forged" })).authorization, undefined);
	assert.equal(upstreamHeaders(headers({ "x-real-ip": "198.51.100.1" }))["x-forwarded-for"], "198.51.100.1");
});

test("only the address our own proxy added is believed, never what the browser wrote in front of it", () => {
	// The browser sent "6.6.6.6"; our proxy appended the address it really saw
	assert.equal(clientIp(headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" })), "203.0.113.9");
	assert.equal(clientIp(headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.9, 10.0.0.2" }), 2), "203.0.113.9");
	assert.equal(clientIp(headers({ "x-forwarded-for": "203.0.113.9" })), "203.0.113.9");
	assert.equal(clientIp(headers({ "x-forwarded-for": "2001:db8::1" })), "2001:db8::1");
	assert.equal(upstreamHeaders(headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }))["x-forwarded-for"], "203.0.113.9");
});

test("with no trusted proxy nothing is passed on, and a value that is not an address is dropped", () => {
	assert.equal(clientIp(headers({ "x-forwarded-for": "203.0.113.9" }), 0), undefined);
	assert.equal(upstreamHeaders(headers({ "x-forwarded-for": "203.0.113.9" }), undefined, 0)["x-forwarded-for"], undefined);
	assert.equal(clientIp(headers({ "x-forwarded-for": "<script>alert(1)</script>" })), undefined);
	assert.equal(clientIp(headers({})), undefined);
});

test("the number of trusted proxies comes from TRUSTED_PROXY_HOPS and defaults to one", () => {
	assert.equal(trustedProxyHops(undefined), 1);
	assert.equal(trustedProxyHops(""), 1);
	assert.equal(trustedProxyHops("0"), 0);
	assert.equal(trustedProxyHops("2"), 2);
	assert.equal(trustedProxyHops("-1"), 1);
	assert.equal(trustedProxyHops("abc"), 1);
});

test("only a refusal of the refresh token ends the session, never a server error or a timeout", () => {
	for (const status of [400, 401, 403]) assert.equal(refreshRejected(status), true);
	for (const status of [404, 429, 500, 502, 503, 504]) assert.equal(refreshRejected(status), false);
});

test("the browser gets the content but never a cached signed-in answer", () => {
	assert.deepEqual(downstreamHeaders(headers({ "content-type": "application/pdf", "content-disposition": "attachment", "set-cookie": "x=1", "cache-control": "max-age=999" })), {
		"cache-control": "no-store",
		"content-type": "application/pdf",
		"content-disposition": "attachment",
	});
});

test("requests that find the token expired together share one refresh", async () => {
	let calls = 0;
	const refresh = async () => {
		calls += 1;
		await new Promise((resolve) => setTimeout(resolve, 10));
		return "fresh";
	};
	const results = await Promise.all([refreshOnce("k", refresh, 0), refreshOnce("k", refresh, 0), refreshOnce("k", refresh, 0)]);
	assert.deepEqual(results, ["fresh", "fresh", "fresh"]);
	assert.equal(calls, 1);
	await refreshOnce("k", refresh, 0); // with no grace time a later refresh runs again
	assert.equal(calls, 2);
});

test("a request that arrives just after a refresh finished gets the new tokens, and a failure is not kept", async () => {
	let calls = 0;
	const ok = async () => {
		calls += 1;
		return "fresh";
	};
	assert.equal(await refreshOnce("grace", ok, 1_000), "fresh");
	assert.equal(await refreshOnce("grace", ok, 1_000), "fresh"); // the late request: same answer, no second refresh
	assert.equal(calls, 1);

	let failures = 0;
	const failing = async () => {
		failures += 1;
		throw new Error("down");
	};
	await assert.rejects(refreshOnce("failing", failing, 1_000));
	await assert.rejects(refreshOnce("failing", failing, 1_000)); // tried again, not served from memory
	assert.equal(failures, 2);
});

test("a call may not hang for ever; an upload gets longer than an ordinary call", () => {
	assert.equal(proxyTimeoutMs("GET", ["hospitals"]), 30_000);
	assert.equal(proxyTimeoutMs("POST", ["appointments"]), 30_000);
	assert.equal(proxyTimeoutMs("POST", ["files", "PROFILE_PICTURE", "id", "3"]), 120_000);
	assert.equal(proxyTimeoutMs("GET", ["files", "access", "PRIVATE"]), 30_000);
});
