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
	/** Menu section. The Dashboard has none and sits at the top. */
	group?: MenuGroup;
}

export type MenuGroup = "People" | "Facilities" | "Reference data" | "Clinical" | "Platform" | "Account";

/** Order of the sections in the menu. */
export const MENU_GROUPS: MenuGroup[] = ["People", "Facilities", "Reference data", "Clinical", "Platform", "Account"];

const crud = (name: string) => [`create-${name}`, `update-${name}`, `delete-${name}`];
const MASTER = crud("master-data");
/** Held by doctors: read-only reference lists, and their own record. Edit buttons still need the real permission. */
const DOCTOR_PANEL = "view-doctor-panel";

export const CONSOLE_RULES: NavRule[] = [
	{ id: "dashboard", title: "Dashboard", url: "/admin", anyOf: [] },
	{ id: "my-doctor-profile", group: "People", title: "My doctor profile", url: "/admin/doctors/me", anyOf: [DOCTOR_PANEL] },
	{ id: "enquiries", group: "Facilities", title: "Enquiries", url: "/admin/enquiries", anyOf: ["update-hospital"], hidden: true },
	{ id: "my-figures", group: "Facilities", title: "My page figures", url: "/admin/my-figures", anyOf: [DOCTOR_PANEL, "update-hospital"] },
	{ id: "appointments", group: "People", title: "Appointments", url: "/admin/appointments", anyOf: [DOCTOR_PANEL] },
	{ id: "reviews", group: "People", title: "Reviews", url: "/admin/reviews", anyOf: [DOCTOR_PANEL] },
	{ id: "my-schedule", group: "People", title: "My schedule", url: "/admin/my-schedule", anyOf: [DOCTOR_PANEL] },
	{ id: "doctors", group: "People", title: "Doctors", url: "/admin/doctors", anyOf: crud("doctor") },
	{ id: "nurses", group: "People", title: "Nurses", url: "/admin/nurses", anyOf: crud("nurse") },
	{ id: "profiles", group: "People", title: "Profiles", url: "/admin/profiles", anyOf: ["view-profile"] },
	{ id: "verification", group: "People", title: "Verification", url: "/admin/verification", anyOf: ["verify-doctor", "verify-facility"] },
	{ id: "institutions", group: "Facilities", title: "Institutions", url: "/admin/institutions", anyOf: [...crud("institution"), DOCTOR_PANEL] },
	{
		id: "hospitals",
		group: "Facilities",
		title: "Hospitals",
		url: "/admin/hospitals",
		anyOf: [...crud("hospital"), ...crud("hospital-amenity"), ...crud("hospital-medical-test")],
	},
	{ id: "medical-specialities", group: "Reference data", title: "Medical Specialities", url: "/admin/medical-specialities", anyOf: MASTER },
	{ id: "medical-tests", group: "Reference data", title: "Medical Tests", url: "/admin/medical-tests", anyOf: MASTER },
	{ id: "medicines", group: "Reference data", title: "Medicines", url: "/admin/medicines", anyOf: [DOCTOR_PANEL] },
	{ id: "associations", group: "Reference data", title: "Associations", url: "/admin/associations", anyOf: [...MASTER, DOCTOR_PANEL] },
	{ id: "social-organizations", group: "Facilities", title: "Social Organizations", url: "/admin/social-organizations", anyOf: crud("social-organization") },
	{ id: "ambulances", group: "Facilities", title: "Ambulances", url: "/admin/ambulances", anyOf: crud("ambulance") },
	{ id: "constants", group: "Reference data", title: "Constants", url: "/admin/constants", anyOf: MASTER },
	{ id: "geolocation", group: "Reference data", title: "Geolocation", url: "/admin/geolocation", anyOf: MASTER },
	{ id: "degrees", group: "Reference data", title: "Degrees", url: "/admin/degrees", anyOf: MASTER },
	{ id: "blood", group: "Facilities", title: "Blood Management", url: "/admin/blood", anyOf: ["manage-blood"] },
	{
		id: "advertisement",
		group: "Platform",
		title: "Advertisement",
		url: "/admin/advertisement",
		anyOf: [...crud("advertisement"), ...crud("advertisement-type")],
	},
	{ id: "blog", group: "Platform", title: "Blog", url: "/admin/blog", anyOf: ["manage-blog"] },
	{ id: "subscriptions", group: "Platform", title: "Plans", url: "/admin/subscriptions", anyOf: ["manage-subscriptions"] },
	{ id: "review-moderation", group: "Platform", title: "Review moderation", url: "/admin/review-moderation", anyOf: ["moderate-reviews"] },
	{ id: "notification-deliveries", group: "Platform", title: "Message delivery", url: "/admin/notification-deliveries", anyOf: ["view-user-activity"] },
	{ id: "data-access", group: "Platform", title: "Data access log", url: "/admin/data-access", anyOf: ["view-user-activity"] },
	{ id: "analytics", group: "Platform", title: "Usage figures", url: "/admin/analytics", anyOf: ["view-super-admin-panel"] },
	{ id: "prescriptions", group: "Clinical", title: "Prescriptions", url: "/admin/prescriptions", anyOf: ["view-prescription"] },
	{ id: "role-permissions", group: "Platform", title: "Roles & Permissions", url: "/admin/role-permissions", anyOf: ["manage-role-permissions"] },

	// Open to everyone signed in
	{ id: "my-consents", group: "Account", title: "My consents", url: "/admin/consents", anyOf: [], always: true },
	{ id: "notifications", title: "Notifications", url: "/admin/notifications", anyOf: [], always: true, hidden: true },
	{ id: "my-profile", title: "My profile", url: "/admin/profile", anyOf: [], always: true, hidden: true },
	{ id: "health", title: "My health", url: "/admin/health", anyOf: [], always: true, hidden: true },
	{ id: "settings", title: "Settings", url: "/admin/settings", anyOf: [], always: true, hidden: true },

	// Guarded pages that are not in the menu: the old Admin Dashboard address redirects to the Dashboard
	{ id: "admin-dashboard", title: "Admin Dashboard", url: "/admin/dashboard", anyOf: ["view-super-admin-panel"], hidden: true },
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

/** The menu as sections, in display order, with empty sections left out. The Dashboard comes first, alone. */
export function groupedMenu(has: Has): { label: MenuGroup | null; items: NavRule[] }[] {
	const items = visibleMenu(has);
	const sections: { label: MenuGroup | null; items: NavRule[] }[] = [];
	const top = items.filter((rule) => !rule.group);
	if (top.length > 0) sections.push({ label: null, items: top });
	for (const group of MENU_GROUPS) {
		const inGroup = items.filter((rule) => rule.group === group);
		if (inGroup.length > 0) sections.push({ label: group, items: inGroup });
	}
	return sections;
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
