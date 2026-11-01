import assert from "node:assert/strict";
import test from "node:test";
import { clientHeaderOk, downstreamHeaders, proxyTimeoutMs, refreshOnce, upstreamHeaders, upstreamUrl } from "./bff-proxy.ts";

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
	const results = await Promise.all([refreshOnce("k", refresh), refreshOnce("k", refresh), refreshOnce("k", refresh)]);
	assert.deepEqual(results, ["fresh", "fresh", "fresh"]);
	assert.equal(calls, 1);
	await refreshOnce("k", refresh); // a later refresh runs again
	assert.equal(calls, 2);
});

test("a call may not hang for ever; an upload gets longer than an ordinary call", () => {
	assert.equal(proxyTimeoutMs("GET", ["hospitals"]), 30_000);
	assert.equal(proxyTimeoutMs("POST", ["appointments"]), 30_000);
	assert.equal(proxyTimeoutMs("POST", ["files", "PROFILE_PICTURE", "id", "3"]), 120_000);
	assert.equal(proxyTimeoutMs("GET", ["files", "access", "PRIVATE"]), 30_000);
});
