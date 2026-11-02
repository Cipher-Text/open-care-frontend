import assert from "node:assert/strict";
import test from "node:test";
import { voidReasonError } from "./prescription-void.ts";

test("a void reason needs a few real words and has an upper limit", () => {
	assert.notEqual(voidReasonError(""), null);
	assert.notEqual(voidReasonError("  ok "), null);
	assert.equal(voidReasonError("Wrong patient"), null);
	assert.equal(voidReasonError("a".repeat(500)), null);
	assert.notEqual(voidReasonError("a".repeat(501)), null);
});
