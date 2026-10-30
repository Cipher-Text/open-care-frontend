import assert from "node:assert/strict";
import { test } from "node:test";
import { ApiError, errorMessage, fieldMessage, type ErrorTranslator } from "./api-error.ts";

const messages: Record<string, string> = { FILE_TOO_LARGE: "Too large", SERVER_ERROR: "Our side", NETWORK: "Offline" };
const t = Object.assign((key: string) => messages[key], { has: (key: string) => key in messages }) as ErrorTranslator;

test("an error with a known code shows the message for that code", () => {
	assert.equal(errorMessage(new ApiError("The file is too large; the limit is 5 MB", 413, "FILE_TOO_LARGE"), t), "Too large");
});

test("an error whose code has no message falls back to the backend's own text", () => {
	assert.equal(errorMessage(new ApiError("Odd refusal", 400, "SOMETHING_NEW"), t), "Odd refusal");
});

test("a network failure and an unknown failure have their own messages", () => {
	assert.equal(errorMessage(new TypeError("Failed to fetch"), t), "Offline");
	assert.equal(errorMessage(undefined, t), "Our side");
	assert.equal(errorMessage(undefined, t, "Custom"), "Custom");
});

test("a field's message is found by its name in a validation failure", () => {
	const error = new ApiError("Title is required", 400, "VALIDATION_FAILED", [{ field: "title", code: "NotBlank", message: "Title is required" }]);
	assert.equal(fieldMessage(error, "title"), "Title is required");
	assert.equal(fieldMessage(error, "slug"), undefined);
	assert.equal(fieldMessage(new Error("x"), "title"), undefined);
});
