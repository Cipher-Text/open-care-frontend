import { publicGet } from "@/lib/api-client";
import { TeacherPositionResponse } from "@/types/teacher-positions";

export const fetchTeacherPositions =
	async (): Promise<TeacherPositionResponse> => {
		const data = await publicGet(`/teacher-positions`);
	return data;
	};
