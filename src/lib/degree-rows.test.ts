import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { degreeProblem, degreesToRequest, emptyDegree, rowFromSaved } from "./degree-rows.ts";

const row = (over: Partial<ReturnType<typeof emptyDegree>>) => ({ ...emptyDegree(), ...over });

describe("degree rows", () => {
	it("rows with no degree are dropped and a typed degree is sent as text", () => {
		const sent = degreesToRequest([row({ typed: true, degreeName: " Diploma in Sports Nutrition ", institutionName: " DU ", passingYear: "2020" }), emptyDegree(), row({ typed: true })]);
		assert.deepEqual(sent, [
			{ degreeId: undefined, degreeName: "Diploma in Sports Nutrition", institutionId: undefined, institutionName: "DU", passingYear: 2020, grade: undefined },
		]);
	});

	it("a degree chosen from the list is sent by id, without a typed name, and so is an institution from the list", () => {
		const sent = degreesToRequest([row({ degreeId: "33", degreeName: "ignored", institutionId: "7", institutionName: "University of Dhaka", grade: " 3.7 " })]);
		assert.deepEqual(sent, [{ degreeId: 33, degreeName: undefined, institutionId: 7, institutionName: "University of Dhaka", passingYear: undefined, grade: "3.7" }]);
	});

	it("a saved row comes back as chosen when it has a list entry and as typed when it has none", () => {
		assert.equal(rowFromSaved({ degreeName: "MSc", degreeId: 33, institutionId: 7, institutionName: "DU", passingYear: 2019 }).typed, false);
		const typed = rowFromSaved({ degreeName: "Certificate", degreeId: null });
		assert.equal(typed.typed, true);
		assert.equal(typed.degreeId, "");
	});

	it("a row with details but no degree is a problem, an empty row is not", () => {
		assert.match(degreeProblem([row({ institutionName: "DU" })]) ?? "", /degree/);
		assert.equal(degreeProblem([emptyDegree()]), null);
		assert.equal(degreeProblem([row({ degreeId: "33", institutionName: "DU" })]), null);
	});

	it("the year must be four digits between 1950 and this year", () => {
		assert.equal(degreeProblem([row({ typed: true, degreeName: "BSc", passingYear: "2017" })], 2026), null);
		assert.match(degreeProblem([row({ typed: true, degreeName: "BSc", passingYear: "1900" })], 2026) ?? "", /between 1950 and 2026/);
		assert.match(degreeProblem([row({ typed: true, degreeName: "BSc", passingYear: "2027" })], 2026) ?? "", /between 1950 and 2026/);
		assert.match(degreeProblem([row({ typed: true, degreeName: "BSc", passingYear: "20x7" })], 2026) ?? "", /between/);
	});
});
