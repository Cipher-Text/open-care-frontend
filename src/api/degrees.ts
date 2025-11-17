import { baseUrl } from "@/config/config";

export interface Degree {
	id: number;
	name: string;
	abbreviation: string;
	degreeType: string;
}

export const fetchDegrees = async (): Promise<Degree[]> => {
	const response = await fetch(`${baseUrl}/degrees/all`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch degrees: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();
	return Array.isArray(data) ? data : [];
};
