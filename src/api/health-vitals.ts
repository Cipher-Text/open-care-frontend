import { baseUrl } from "@/config/config";
import { apiDelete, apiGet, apiPatch, apiPost, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
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

// ---- recording and managing readings (the person's own)

/** The everyday readings the form takes. Every field is optional; empty ones are left out. */
export interface ReadingInput {
  recordedAt?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  bloodGlucoseMgDl?: number;
  glucoseMeasurementType?: string;
  weightKg?: number;
  heightCm?: number;
  temperatureCelsius?: number;
  oxygenSaturation?: number;
  symptoms?: string;
  notes?: string;
}

/** What the history list needs from a stored reading. */
export interface Reading extends ReadingInput {
  id: number;
  recordedAt: string;
}

const unwrap = <T,>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
  if (!response.ok) throw new Error(response.error || fallback);
  return response.data as T;
};

export const fetchMyReadings = async (page: number, size: number): Promise<PageResult<Reading>> =>
  normalizePage(unwrap<WirePage<Reading>>(await apiGet(buildUrl("/health-vitals/self", { page: toWirePage(page), size })), "Could not load your readings"));

/** Saves a new reading. The server refuses (422) until the person has agreed to health data consent. */
export const addReading = async (input: ReadingInput) => unwrap<Reading>(await apiPost("/health-vitals", input), "Could not save the reading");

/** Changes only the fields sent. */
export const changeReading = async (id: number, input: ReadingInput) =>
  unwrap<Reading>(await apiPatch(`/health-vitals/${id}`, input), "Could not save the reading");

export const deleteReading = async (id: number) => {
  const response = await apiDelete(`/health-vitals/${id}`);
  if (!response.ok) throw new Error(response.error || "Could not delete the reading");
};
