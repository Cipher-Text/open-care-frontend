/**
 * Who sees which part of the admin console. One list drives the sidebar, the page guard, the middleware
 * and the redirect after login, so they cannot disagree. Pure data and functions (no imports) so it also
 * runs in the middleware and in tests.
 *
 * A rule is visible to someone who holds ANY of its permissions. These are the same permissions the API
 * enforces on the matching routes; this file only decides what to show, the API is the real lock.
 */

export interface NavRule {
	id: string;
	title: string;
	/** Route prefix. "/admin" matches only itself. */
	url: string;
	/** Visible when the person holds any of these. Empty with `always` means everyone signed in. */
	anyOf: string[];
	/** Shown to every signed-in person and not counted when deciding who is staff. */
	always?: boolean;
	/** Reachable and guarded, but not listed in the menu. */
	hidden?: boolean;
}

const crud = (name: string) => [`create-${name}`, `update-${name}`, `delete-${name}`];
const MASTER = crud("master-data");

export const CONSOLE_RULES: NavRule[] = [
	{ id: "dashboard", title: "Dashboard", url: "/admin", anyOf: [] },
	{ id: "admin-dashboard", title: "Admin Dashboard", url: "/admin/dashboard", anyOf: ["view-super-admin-panel"] },
	{ id: "doctors", title: "Doctors", url: "/admin/doctors", anyOf: crud("doctor") },
	{ id: "nurses", title: "Nurses", url: "/admin/nurses", anyOf: crud("nurse") },
	{ id: "profiles", title: "Profiles", url: "/admin/profiles", anyOf: ["view-profile"] },
	{ id: "institutions", title: "Institutions", url: "/admin/institutions", anyOf: crud("institution") },
	{
		id: "hospitals",
		title: "Hospitals",
		url: "/admin/hospitals",
		anyOf: [...crud("hospital"), ...crud("hospital-amenity"), ...crud("hospital-medical-test")],
	},
	{ id: "medical-specialities", title: "Medical Specialities", url: "/admin/medical-specialities", anyOf: MASTER },
	{ id: "medical-tests", title: "Medical Tests", url: "/admin/medical-tests", anyOf: MASTER },
	{ id: "associations", title: "Associations", url: "/admin/associations", anyOf: MASTER },
	{ id: "social-organizations", title: "Social Organizations", url: "/admin/social-organizations", anyOf: crud("social-organization") },
	{ id: "ambulances", title: "Ambulances", url: "/admin/ambulances", anyOf: crud("ambulance") },
	{ id: "constants", title: "Constants", url: "/admin/constants", anyOf: MASTER },
	{ id: "geolocation", title: "Geolocation", url: "/admin/geolocation", anyOf: MASTER },
	{ id: "degrees", title: "Degrees", url: "/admin/degrees", anyOf: MASTER },
	{ id: "blood", title: "Blood Management", url: "/admin/blood", anyOf: ["manage-blood"] },
	{
		id: "advertisement",
		title: "Advertisement",
		url: "/admin/advertisement",
		anyOf: [...crud("advertisement"), ...crud("advertisement-type")],
	},
	{ id: "prescriptions", title: "Prescriptions", url: "/admin/prescriptions", anyOf: ["view-prescription"] },
	{ id: "role-permissions", title: "Roles & Permissions", url: "/admin/role-permissions", anyOf: ["manage-role-permissions"] },

	// Open to everyone signed in
	{ id: "my-consents", title: "My consents", url: "/admin/consents", anyOf: [], always: true },
	{ id: "my-profile", title: "My profile", url: "/admin/profile", anyOf: [], always: true, hidden: true },
	{ id: "health", title: "My health", url: "/admin/health", anyOf: [], always: true, hidden: true },
	{ id: "settings", title: "Settings", url: "/admin/settings", anyOf: [], always: true, hidden: true },

	// Guarded pages that are not in the menu
	{ id: "users", title: "Users", url: "/admin/users", anyOf: ["view-profile"], hidden: true },
	{ id: "analytics", title: "Analytics", url: "/admin/analytics", anyOf: ["view-super-admin-panel"], hidden: true },
];

export type Has = (permission: string) => boolean;

const holds = (rule: NavRule, has: Has) => rule.always === true || rule.anyOf.some(has);

/** Someone is staff when they hold a permission that unlocks at least one console page. */
export function isStaff(has: Has): boolean {
	return CONSOLE_RULES.some((rule) => !rule.always && rule.anyOf.length > 0 && rule.anyOf.some(has));
}

/** The menu entries this person sees. The Dashboard overview is for staff only. */
export function visibleMenu(has: Has): NavRule[] {
	const staff = isStaff(has);
	return CONSOLE_RULES.filter((rule) => {
		if (rule.hidden) return false;
		if (rule.id === "dashboard") return staff;
		return holds(rule, has);
	});
}

/** The rule that governs a path: the longest matching prefix, with "/admin" matching only itself. */
export function ruleFor(pathname: string): NavRule | undefined {
	const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
	let best: NavRule | undefined;
	for (const rule of CONSOLE_RULES) {
		const matches = rule.url === "/admin" ? path === "/admin" : path === rule.url || path.startsWith(rule.url + "/");
		if (matches && (!best || rule.url.length > best.url.length)) best = rule;
	}
	return best;
}

/** May this person open this console path? Unknown console paths are for staff only. */
export function routeAllowed(pathname: string, has: Has): boolean {
	const rule = ruleFor(pathname);
	if (!rule) return isStaff(has);
	if (rule.id === "dashboard") return isStaff(has);
	return holds(rule, has);
}

/** Where a person lands after signing in: staff in the console, everyone else in their own account area. */
export function landingPath(has: Has): string {
	return isStaff(has) ? "/admin" : "/account";
}
