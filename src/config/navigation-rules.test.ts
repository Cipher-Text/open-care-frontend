import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { groupedMenu, isStaff, landingPath, routeAllowed, visibleMenu } from "./navigation-rules.ts";

// Run with: npm run test:nav
// The fixture is the live role-to-permission mapping (GET /api/role-permissions as super admin).
// Refresh it after changing roles, and update the expectations below on purpose.
const mapping: Record<string, string[]> = JSON.parse(
	readFileSync(new URL("./role-permissions.fixture.json", import.meta.url), "utf8")
);

const hasFor = (role: string) => {
	const permissions = new Set(mapping[role] ?? []);
	return (permission: string) => permissions.has(permission);
};
const menu = (role: string) => visibleMenu(hasFor(role)).map((rule) => rule.id);

const EVERYONE = ["my-consents"];

const EXPECTED: Record<string, { staff: boolean; menu: string[] }> = {
	"super-admin": {
		staff: true,
		menu: [
			"dashboard", "admin-dashboard", "doctors", "nurses", "profiles", "institutions", "hospitals",
			"medical-specialities", "medical-tests", "associations", "social-organizations", "ambulances",
			"constants", "geolocation", "degrees", "blood", "advertisement", "role-permissions", "my-consents",
		],
	},
	admin: {
		staff: true,
		menu: [
			"dashboard", "doctors", "nurses", "profiles", "institutions", "hospitals", "medical-specialities",
			"medical-tests", "associations", "social-organizations", "constants", "geolocation", "degrees", "blood", "my-consents",
		],
	},
	moderator: {
		staff: true,
		menu: ["dashboard", "doctors", "nurses", "profiles", "institutions", "hospitals", "social-organizations", "blood", "my-consents"],
	},
	operator: {
		staff: true,
		menu: ["dashboard", "doctors", "nurses", "profiles", "hospitals", "social-organizations", "blood", "my-consents"],
	},
	"hospital-admin": {
		staff: true,
		menu: ["dashboard", "doctors", "nurses", "hospitals", "ambulances", "blood", "my-consents"],
	},
	"institution-admin": { staff: true, menu: ["dashboard", "institutions", "my-consents"] },
	"social-organization-admin": { staff: true, menu: ["dashboard", "social-organizations", "ambulances", "my-consents"] },
	"association-admin": {
		staff: true,
		menu: ["dashboard", "medical-specialities", "medical-tests", "associations", "constants", "geolocation", "degrees", "my-consents"],
	},
	doctor: { staff: true, menu: ["dashboard", "doctors", "prescriptions", "my-consents"] },
	nurse: { staff: true, menu: ["dashboard", "nurses", "my-consents"] },
	user: { staff: false, menu: EVERYONE },
	"hospital-user": { staff: false, menu: EVERYONE },
	"institution-user": { staff: false, menu: EVERYONE },
	"social-organization-user": { staff: false, menu: EVERYONE },
	"association-user": { staff: false, menu: EVERYONE },
};

test("the fixture covers every role this file has expectations for", () => {
	assert.deepEqual(Object.keys(EXPECTED).sort(), Object.keys(mapping).sort());
});

for (const [role, expected] of Object.entries(EXPECTED)) {
	test(`${role}: menu and landing page`, () => {
		assert.deepEqual(menu(role), expected.menu);
		assert.equal(isStaff(hasFor(role)), expected.staff);
		assert.equal(landingPath(hasFor(role)), expected.staff ? "/admin" : "/account");
	});
}

test("a path is allowed exactly when its menu entry is visible", () => {
	const paths: Record<string, string> = {
		doctors: "/admin/doctors/12", hospitals: "/admin/hospitals/3/view", profiles: "/admin/profiles/9",
		prescriptions: "/admin/prescriptions/new", "role-permissions": "/admin/role-permissions",
		blood: "/admin/blood", "admin-dashboard": "/admin/dashboard",
	};
	for (const role of Object.keys(EXPECTED)) {
		const visible = new Set(menu(role));
		for (const [id, path] of Object.entries(paths)) {
			assert.equal(routeAllowed(path, hasFor(role)), visible.has(id), `${role} ${path}`);
		}
	}
});

test("unknown console paths are for staff only; own pages are for everyone signed in", () => {
	assert.equal(routeAllowed("/admin/something-new", hasFor("user")), false);
	assert.equal(routeAllowed("/admin/something-new", hasFor("doctor")), true);
	for (const role of Object.keys(EXPECTED)) {
		for (const path of ["/admin/profile", "/admin/consents", "/admin/health", "/admin/settings"]) {
			assert.equal(routeAllowed(path, hasFor(role)), true, `${role} ${path}`);
		}
	}
});

test("the dashboard overview is for staff, and /admin/analytics and /admin/users follow their permission", () => {
	assert.equal(routeAllowed("/admin", hasFor("user")), false);
	assert.equal(routeAllowed("/admin", hasFor("nurse")), true);
	assert.equal(routeAllowed("/admin/analytics", hasFor("admin")), false);
	assert.equal(routeAllowed("/admin/analytics", hasFor("super-admin")), true);
	assert.equal(routeAllowed("/admin/users", hasFor("moderator")), true);
	assert.equal(routeAllowed("/admin/users", hasFor("doctor")), false);
});

test("the menu is grouped in a fixed order, with empty sections left out", () => {
	const sections = (role: string) => groupedMenu(hasFor(role)).map((s) => s.label);
	assert.deepEqual(sections("super-admin"), [null, "People", "Facilities", "Reference data", "Platform", "Account"]);
	assert.deepEqual(sections("doctor"), [null, "People", "Clinical", "Account"]);
	assert.deepEqual(sections("institution-admin"), [null, "Facilities", "Account"]);
	assert.deepEqual(sections("user"), ["Account"]);
	// Grouping never adds or removes an entry
	for (const role of Object.keys(EXPECTED)) {
		const flat = groupedMenu(hasFor(role)).flatMap((s) => s.items.map((r) => r.id)).sort();
		assert.deepEqual(flat, [...menu(role)].sort(), role);
	}
});
