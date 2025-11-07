"use client";

import { apiRequest } from "@/lib/api-client";
import { Country } from "@/types/countries";

/**
 * Fetches all countries
 */
export async function getCountries() {
  return apiRequest<Country[]>("/countries", {
    method: "GET",
  });
}
