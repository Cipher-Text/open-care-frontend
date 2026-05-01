import { baseUrl } from "@/config/config";
import { GenderResponse } from "@/types/gender";

export const fetchGenders = async (): Promise<GenderResponse> => {
  const response = await fetch(`${baseUrl}/gender`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch genders: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
