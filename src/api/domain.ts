"use client";

import { apiRequest } from "@/lib/api-client";
import { Domain } from "@/types/domain";

/**
 * Fetches all domains
 */
export async function getDomains() {
  return apiRequest<Domain[]>("/domain", {
    method: "GET",
  });
}
