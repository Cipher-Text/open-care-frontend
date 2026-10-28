"use client";

import { apiRequest } from "@/lib/api-client";
import { DashboardOverview } from "@/types/dashboard";

/**
 * Fetches the dashboard overview statistics (real counts only)
 */
export async function getDashboardOverview() {
  return apiRequest<DashboardOverview>("/superadmin/dashboard/overview", {
    method: "GET",
  });
}
