import { apiGet } from "@/lib/api-client";
import type { OrganisationMembership } from "@/api/organisation-roles";
import { capabilitiesShape, checked } from "@/lib/api-shapes";

export interface Capabilities {
	userType: string | null;
	permissions: string[];
	features: Record<string, boolean>;
	/** The organisations the person belongs to, each with their role there. */
	organisations: OrganisationMembership[];
}

/** The signed-in person's permissions and feature flags, read from Keycloak by the API on every call. */
export const fetchCapabilities = async (): Promise<Capabilities> => {
	const response = await apiGet<Capabilities>("/me/capabilities");
	if (!response.ok || !response.data) throw new Error(response.error || "Failed to load capabilities");
	return checked(capabilitiesShape, response.data, "capabilities");
};
