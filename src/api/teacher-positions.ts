import { baseUrl } from "@/config/config";
import { TeacherPositionResponse } from "@/types/teacher-positions";

export const fetchTeacherPositions =
	async (): Promise<TeacherPositionResponse> => {
		const response = await fetch(`${baseUrl}/teacher-positions`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch teacher positions: ${response.status} ${response.statusText}`
			);
		}

		return response.json();
	};
