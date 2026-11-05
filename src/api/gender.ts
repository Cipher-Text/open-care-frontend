import { publicGet } from "@/lib/api-client";
import { GenderResponse } from "@/types/gender";

export const fetchGenders = async (): Promise<GenderResponse> => {
  const data = await publicGet(`/gender`);
	return data;
};
