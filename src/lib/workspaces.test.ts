import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { currentWorkspace, workspacesFor } from "./workspaces.ts";

const hospital = { kind: "HOSPITAL", organisationId: 3, name: "Square Hospital", role: "ADMIN", position: null } as const;
const association = { kind: "ASSOCIATION", organisationId: 5, name: "BMA", role: "USER", position: null } as const;

describe("workspaces", () => {
	it("a plain user has only the personal workspace", () => {
		const list = workspacesFor("USER", []);
		assert.deepEqual(list.map((w) => w.id), ["personal"]);
	});

	it("a doctor who administers a hospital and belongs to an association has four, in a fixed order", () => {
		const list = workspacesFor("DOCTOR", [hospital, association]);
		assert.deepEqual(list.map((w) => w.id), ["personal", "doctor", "HOSPITAL-3", "ASSOCIATION-5"]);
		assert.equal(list[2].detail, "Hospital, admin");
		assert.equal(list[3].detail, "Association, member");
	});

	it("platform staff get the platform workspace", () => {
		assert.deepEqual(workspacesFor("ADMIN", []).map((w) => w.id), ["personal", "platform"]);
	});

	it("a nutritionist has a professional workspace in the account area", () => {
		const list = workspacesFor("NUTRITIONIST", []);
		assert.deepEqual(list.map((w) => w.id), ["personal", "nutritionist"]);
		assert.equal(currentWorkspace(list, "/account/nutritionist")?.id, "nutritionist");
		assert.equal(currentWorkspace(list, "/account/profile")?.id, "personal");
	});

	it("an organisation's own pages belong to that workspace, the rest of the console to the person's", () => {
		const list = workspacesFor("DOCTOR", [hospital]);
		assert.equal(currentWorkspace(list, "/admin/hospitals/3/view")?.id, "HOSPITAL-3");
		assert.equal(currentWorkspace(list, "/admin/hospitals/3/edit")?.id, "HOSPITAL-3");
		assert.equal(currentWorkspace(list, "/admin/hospitals/31/view")?.id, "doctor");
		assert.equal(currentWorkspace(list, "/admin/prescriptions")?.id, "doctor");
		assert.equal(currentWorkspace(list, "/account")?.id, "personal");
	});

	it("the link of each workspace lands inside it", () => {
		for (const w of workspacesFor("DOCTOR", [hospital, association])) {
			assert.ok(w.owns(w.href), w.id);
		}
	});

	it("an unknown page falls back to the first workspace", () => {
		assert.equal(currentWorkspace(workspacesFor("USER", []), "/somewhere")?.id, "personal");
	});
});
