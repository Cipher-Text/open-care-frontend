import { baseUrl } from "@/config/config";
import { HealthVitals } from "@/types/health-vitals";

/**
 * Get latest health vitals for the current user
 */
export const getLatestHealthVitals = async (
  token: string
): Promise<HealthVitals> => {
  const response = await fetch(`${baseUrl}/health-vitals/self/latest`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch health vitals: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
