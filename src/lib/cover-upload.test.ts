import assert from "node:assert/strict";
import test from "node:test";
import { COVER_MAX_BYTES, coverFileProblem } from "./cover-upload.ts";

test("a JPEG, PNG or WebP picture up to 5 MB can be uploaded", () => {
	for (const type of ["image/jpeg", "image/png", "image/webp"]) assert.equal(coverFileProblem({ type, size: 1000 }), null);
	assert.equal(coverFileProblem({ type: "image/png", size: COVER_MAX_BYTES }), null);
});

test("other types, empty files and big pictures are refused in plain words", () => {
	assert.match(coverFileProblem({ type: "application/pdf", size: 1000 })!, /JPEG, PNG or WebP/);
	assert.match(coverFileProblem({ type: "image/gif", size: 1000 })!, /JPEG, PNG or WebP/);
	assert.match(coverFileProblem({ type: "image/png", size: 0 })!, /empty/);
	assert.match(coverFileProblem({ type: "image/png", size: COVER_MAX_BYTES + 1 })!, /5 MB/);
});
