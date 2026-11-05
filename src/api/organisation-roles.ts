import { apiGet, apiPost, unwrap } from "@/lib/api-client";

/** The four kinds of organisation a person can belong to. */
export type OrganisationKind = "HOSPITAL" | "INSTITUTION" | "SOCIAL_ORGANIZATION" | "ASSOCIATION";
export type OrganisationRole = "ADMIN" | "USER";

export interface OrganisationMembership {
	kind: OrganisationKind;
	organisationId: number;
	name: string;
	role: OrganisationRole;
	position: string | null;
}

export const KIND_LABEL: Record<OrganisationKind, string> = {
	HOSPITAL: "Hospital",
	INSTITUTION: "Institution",
	SOCIAL_ORGANIZATION: "Social organisation",
	ASSOCIATION: "Association",
};

export const ROLE_LABEL: Record<OrganisationRole, string> = { ADMIN: "Admin", USER: "Member" };

const LIST_PATH: Record<OrganisationKind, string> = {
	HOSPITAL: "/hospitals",
	INSTITUTION: "/institutions",
	SOCIAL_ORGANIZATION: "/social-organizations",
	ASSOCIATION: "/associations",
};

/** The request body of the add and remove routes: the type is the organisation kind and role together, for example HOSPITAL_ADMIN. */
export const roleType = (kind: OrganisationKind, role: OrganisationRole) => `${kind}_${role}`;

/** The organisations a person belongs to, each with their role there (staff with view-profile or assign-user-role). */
export async function fetchOrganisationRoles(profileId: number): Promise<OrganisationMembership[]> {
	return unwrap(await apiGet<OrganisationMembership[]>(`/user/${profileId}/organisation-roles`), "Could not load the organisations");
}

export async function addOrganisationRole(profileId: number, kind: OrganisationKind, role: OrganisationRole, organisationId: number, position: string) {
	unwrap(
		await apiPost(`/user/${profileId}/assign-user-type`, {
			userType: roleType(kind, role),
			domainId: String(organisationId),
			position: position.trim() || (role === "ADMIN" ? "Administrator" : "Member"),
			startDate: new Date().toISOString().slice(0, 10),
			endDate: "2999-12-31",
		}),
		"Could not add the role"
	);
}

export async function removeOrganisationRole(profileId: number, kind: OrganisationKind, role: OrganisationRole, organisationId: number) {
	unwrap(await apiPost(`/user/${profileId}/remove-user-type`, { userType: roleType(kind, role), domainId: String(organisationId) }), "Could not remove the role");
}

/** Organisations of a kind whose name contains the text, for the picker (a few at a time). */
export async function searchOrganisations(kind: OrganisationKind, text: string): Promise<{ id: number; name: string }[]> {
	const query = new URLSearchParams({ name: text.trim(), size: "8", page: "0" });
	const page = unwrap(await apiGet<{ content?: { id: number; name: string }[] }>(`${LIST_PATH[kind]}?${query}`), "Could not search");
	return (page.content ?? []).map((row) => ({ id: row.id, name: row.name }));
}
