import { publicGet } from "@/lib/api-client";
import { BloodGroupResponse } from "@/types/blood-groups";

export const fetchBloodGroups = async (): Promise<BloodGroupResponse> => {
  const data = await publicGet(`/blood-groups`);
	return data;
};
