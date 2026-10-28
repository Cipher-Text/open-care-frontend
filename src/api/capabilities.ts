import { apiGet } from "@/lib/api-client";

export interface Capabilities {
	userType: string | null;
	permissions: string[];
	features: Record<string, boolean>;
}

/** The signed-in person's permissions and feature flags, read from Keycloak by the API on every call. */
export const fetchCapabilities = async (): Promise<Capabilities> => {
	const response = await apiGet<Capabilities>("/me/capabilities");
	if (!response.ok || !response.data) throw new Error(response.error || "Failed to load capabilities");
	return response.data;
};
