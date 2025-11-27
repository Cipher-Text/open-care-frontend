"use client";

import { apiRequest } from "@/lib/api-client";
import { ContributionAction } from "@/types/contribution-actions";

/**
 * Fetches all contribution actions
 */
export async function getContributionActions() {
  return apiRequest<ContributionAction[]>("/contribution-actions", {
    method: "GET",
  });
}
