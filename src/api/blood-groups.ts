import { baseUrl } from "@/config/config";
import { BloodGroupResponse } from "@/types/blood-groups";

export const fetchBloodGroups = async (): Promise<BloodGroupResponse> => {
  const response = await fetch(`${baseUrl}/blood-groups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch blood groups: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
