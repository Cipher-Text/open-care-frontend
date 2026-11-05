import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { degreeProblem, degreesToRequest, emptyDegree } from "./degree-rows.ts";

const row = (over: Partial<ReturnType<typeof emptyDegree>>) => ({ ...emptyDegree(), ...over });

describe("degree rows", () => {
	it("blank rows are dropped and the year becomes a number", () => {
		const sent = degreesToRequest([row({ degreeName: " MSc in Dietetics ", institutionName: " DU ", passingYear: "2020" }), emptyDegree(), row({ degreeName: "BSc" })]);
		assert.deepEqual(sent, [
			{ degreeName: "MSc in Dietetics", institutionName: "DU", passingYear: 2020, grade: undefined },
			{ degreeName: "BSc", institutionName: undefined, passingYear: undefined, grade: undefined },
		]);
	});

	it("a row with details but no name is a problem, an empty row is not", () => {
		assert.match(degreeProblem([row({ institutionName: "DU" })]) ?? "", /name/);
		assert.equal(degreeProblem([emptyDegree()]), null);
	});

	it("the year must be four digits between 1950 and this year", () => {
		assert.equal(degreeProblem([row({ degreeName: "BSc", passingYear: "2017" })], 2026), null);
		assert.match(degreeProblem([row({ degreeName: "BSc", passingYear: "1900" })], 2026) ?? "", /between 1950 and 2026/);
		assert.match(degreeProblem([row({ degreeName: "BSc", passingYear: "2027" })], 2026) ?? "", /between 1950 and 2026/);
		assert.match(degreeProblem([row({ degreeName: "BSc", passingYear: "20x7" })], 2026) ?? "", /between/);
	});
});
