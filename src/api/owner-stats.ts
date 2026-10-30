import { apiGet, buildUrl } from "@/lib/api-client";

export interface OwnerDay {
	day: string;
	views: number;
	calls: number;
	directions: number;
}

export interface OwnerSubject {
	kind: "DOCTOR" | "HOSPITAL";
	id: number;
	name: string | null;
	slug: string;
	/** False when the plan does not include the figures; the numbers are then null. */
	allowed: boolean;
	views: number | null;
	calls: number | null;
	directions: number | null;
	daily: OwnerDay[];
}

/** What the public did on the signed-in person's own doctor page or facility pages. */
export const fetchOwnerStats = async (days: number): Promise<OwnerSubject[]> => {
	const response = await apiGet<{ subjects: OwnerSubject[] }>(buildUrl("/owner/stats", { days }));
	if (!response.ok) throw new Error(response.error || "Could not load your figures");
	return response.data?.subjects ?? [];
};
