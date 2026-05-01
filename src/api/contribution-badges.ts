"use client";

import { apiRequest } from "@/lib/api-client";
import { ContributionBadge } from "@/types/contribution-badges";

/**
 * Fetches all contribution badges
 */
export async function getContributionBadges() {
  return apiRequest<ContributionBadge[]>("/contribution-badges", {
    method: "GET",
  });
}
