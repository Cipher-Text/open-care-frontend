import assert from "node:assert/strict";
import { test } from "node:test";
import { safeUrl } from "./safe-url.ts";

test("http, https, mailto and tel links are allowed", () => {
	assert.equal(safeUrl("http://example.com/a"), "http://example.com/a");
	assert.equal(safeUrl("https://example.com/a?b=1"), "https://example.com/a?b=1");
	assert.equal(safeUrl("mailto:info@example.com"), "mailto:info@example.com");
	assert.equal(safeUrl("tel:+880123456789"), "tel:+880123456789");
});

test("script-capable and unknown schemes are dropped", () => {
	assert.equal(safeUrl("javascript:alert(1)"), null);
	assert.equal(safeUrl("  JavaScript:alert(1)"), null);
	assert.equal(safeUrl("data:text/html,<script>alert(1)</script>"), null);
	assert.equal(safeUrl("vbscript:msgbox(1)"), null);
});

test("empty and missing values give nothing", () => {
	assert.equal(safeUrl(""), null);
	assert.equal(safeUrl("   "), null);
	assert.equal(safeUrl(null), null);
	assert.equal(safeUrl(undefined), null);
});

test("a bare domain is treated as https", () => {
	assert.equal(safeUrl("example.com"), "https://example.com/");
	assert.equal(safeUrl("example.com:8080/x"), "https://example.com:8080/x");
});
