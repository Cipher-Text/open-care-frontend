import type { OrganisationMembership } from "@/api/organisation-roles";

/**
 * A person has one type (patient, doctor, nurse, nutritionist or platform staff) and any number of organisation roles. Each of
 * these is a workspace: a place with its own home page and menu. The switcher only moves between them; it never changes what the
 * person may do, because the server checks the combined permissions on every call.
 */
export interface Workspace {
	id: string;
	label: string;
	detail: string;
	href: string;
	/** True when this pathname belongs to the workspace (organisation pages first, then the person's own areas). */
	owns: (pathname: string) => boolean;
}

const STAFF_TYPES = new Set(["SUPER_ADMIN", "ADMIN", "MODERATOR", "OPERATOR"]);

const SEGMENT: Record<OrganisationMembership["kind"], { segment: string; label: string }> = {
	HOSPITAL: { segment: "hospitals", label: "Hospital" },
	INSTITUTION: { segment: "institutions", label: "Institution" },
	SOCIAL_ORGANIZATION: { segment: "social-organizations", label: "Social organisation" },
	ASSOCIATION: { segment: "associations", label: "Association" },
};

const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(base + "/");

export function workspacesFor(userType: string | null, organisations: OrganisationMembership[]): Workspace[] {
	const list: Workspace[] = [];
	const nutritionist = userType === "NUTRITIONIST";
	const nurse = userType === "NURSE";

	list.push({
		id: "personal",
		label: "Personal",
		detail: "My profile, health and care",
		href: "/account",
		owns: (p) => under(p, "/account") && !(nutritionist && under(p, "/account/nutritionist")) && !(nurse && under(p, "/account/nurse")),
	});
	if (nutritionist) {
		list.push({ id: "nutritionist", label: "Nutritionist", detail: "My professional profile", href: "/account/nutritionist", owns: (p) => under(p, "/account/nutritionist") });
	}

	if (nurse) {
		list.push({ id: "nurse", label: "Nurse", detail: "My professional profile", href: "/account/nurse", owns: (p) => under(p, "/account/nurse") });
	}

	const orgOwned = organisations.map((m) => {
		const { segment, label } = SEGMENT[m.kind];
		const base = `/admin/${segment}/${m.organisationId}`;
		return {
			id: `${m.kind}-${m.organisationId}`,
			label: m.name,
			detail: `${label}, ${m.role === "ADMIN" ? "admin" : "member"}`,
			href: `${base}/view`,
			owns: (p: string) => under(p, base),
		} satisfies Workspace;
	});

	const console_: Workspace | null =
		userType === "DOCTOR"
			? { id: "doctor", label: "Doctor", detail: "Practice, schedule and prescriptions", href: "/admin", owns: (p) => under(p, "/admin") }
			: userType && STAFF_TYPES.has(userType)
			? { id: "platform", label: "Platform", detail: "Run the directory", href: "/admin", owns: (p) => under(p, "/admin") }
			: null;
	if (console_) list.push(console_);
	list.push(...orgOwned);
	return list;
}

/** The workspace the page belongs to: an organisation's own pages first, then the person's areas. */
export function currentWorkspace(list: Workspace[], pathname: string): Workspace | undefined {
	const organisation = list.find((w) => w.id.includes("-") && w.owns(pathname));
	return organisation ?? list.find((w) => w.owns(pathname)) ?? list[0];
}
