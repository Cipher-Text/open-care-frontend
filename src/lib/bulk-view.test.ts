import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { BulkColumn, BulkResponse } from "../api/bulk-upload.ts";
import { canSave, summaryLine, templateCsv, toRows } from "./bulk-view.ts";

const columns: BulkColumn[] = [
	{ key: "name", label: "Name", required: true, help: "", example: "Alpha, Clinic" },
	{ key: "price", label: "Price", required: false, help: "", example: '5"00' },
];
const response = (over: Partial<BulkResponse>): BulkResponse => ({ kind: "HOSPITAL", saved: false, maxRows: 50, toCreate: 0, toUpdate: 0, unchanged: 0, withProblems: 0, rows: [], ...over });

describe("bulk upload view rules", () => {
	it("makes a template with the keys and one quoted example row", () => {
		assert.equal(templateCsv(columns), 'name,price\n"Alpha, Clinic","5""00"\n');
	});

	it("sends back only filled, trimmed cells", () => {
		assert.deepEqual(toRows([{ rowNumber: 3, values: { name: "  Alpha ", price: "   ", id: "" } }]), [{ rowNumber: 3, values: { name: "Alpha" } }]);
	});

	it("describes what the rows would do", () => {
		assert.equal(summaryLine(response({ toCreate: 2, toUpdate: 1, withProblems: 1 })), "2 to add, 1 to change, 1 with a problem");
		assert.equal(summaryLine(response({})), "No rows");
	});

	it("offers saving only after a clean check with something to do, and not after an edit", () => {
		assert.equal(canSave(null, false), false);
		assert.equal(canSave(response({ toCreate: 1 }), false), true);
		assert.equal(canSave(response({ toCreate: 1 }), true), false);
		assert.equal(canSave(response({ toCreate: 1, withProblems: 1 }), false), false);
		assert.equal(canSave(response({ unchanged: 2 }), false), false);
	});
});
