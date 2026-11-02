import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { capabilitiesShape, checked, pageShape, UnexpectedAnswerError } from "./api-shapes.ts";

describe("api answer shapes", () => {
	it("accepts a normal page and an empty one", () => {
		assert.doesNotThrow(() => checked(pageShape, { content: [{ id: 1 }], currentPage: 0, totalItems: 1, totalPages: 1 }, "list"));
		assert.doesNotThrow(() => checked(pageShape, {}, "list"));
		assert.doesNotThrow(() => checked(pageShape, { content: null, totalItems: null }, "list"));
	});

	it("refuses a page whose parts have the wrong type", () => {
		for (const bad of [{ content: "x" }, { content: {} }, { totalItems: "12" }, { totalPages: -1 }, { currentPage: 1.5 }, null, "page"]) {
			assert.throws(() => checked(pageShape, bad, "list"), UnexpectedAnswerError);
		}
	});

	it("accepts real capabilities and refuses ones that could be misread as 'no permissions'", () => {
		assert.deepEqual(checked(capabilitiesShape, { userType: "DOCTOR", permissions: ["a"], features: { x: true } }, "capabilities").permissions, ["a"]);
		assert.doesNotThrow(() => checked(capabilitiesShape, { userType: null, permissions: [], features: {} }, "capabilities"));
		for (const bad of [{}, { userType: "X", permissions: "a", features: {} }, { userType: "X", permissions: [1], features: {} }, { userType: "X", permissions: [], features: { a: "yes" } }, []]) {
			assert.throws(() => checked(capabilitiesShape, bad, "capabilities"), UnexpectedAnswerError);
		}
	});
});
