import { apiGet, apiPost, apiPut, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";
import type {
	DoctorContext,
	MedicineSuggestion,
	Prescription,
	PrescriptionInput,
	PrescriptionRevision,
	PrescriptionSummary,
} from "@/types/prescriptions";

/** The signed-in doctor's prescriptions. Every call needs a login and the matching prescription permission. */

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

export const fetchDoctorContext = async () =>
	unwrap<DoctorContext>(await apiGet("/prescriptions/doctor-context"), "Failed to load your doctor profile");

export interface PrescriptionFilters {
	page: number;
	size: number;
	patient?: string;
	from?: string;
	to?: string;
}

export const fetchPrescriptions = async (filters: PrescriptionFilters): Promise<PageResult<PrescriptionSummary>> => {
	const url = buildUrl("/prescriptions", {
		page: toWirePage(filters.page),
		size: filters.size,
		patient: filters.patient || undefined,
		from: filters.from || undefined,
		to: filters.to || undefined,
	});
	return normalizePage(unwrap<WirePage<PrescriptionSummary>>(await apiGet(url), "Failed to load prescriptions"));
};

export const fetchPrescription = async (id: number | string) =>
	unwrap<Prescription>(await apiGet(`/prescriptions/${id}`), "Failed to load the prescription");

export const createPrescription = async (input: PrescriptionInput) =>
	unwrap<Prescription>(await apiPost("/prescriptions", input), "Failed to save the prescription");

export const updatePrescription = async (id: number | string, input: PrescriptionInput) =>
	unwrap<Prescription>(await apiPut(`/prescriptions/${id}`, input), "Failed to save the prescription");

/** The earlier versions of a prescription, newest first. Each edit inside the edit window keeps the version it replaced. */
export const fetchRevisions = async (id: number | string) =>
	unwrap<PrescriptionRevision[]>(await apiGet(`/prescriptions/${id}/revisions`), "Failed to load the earlier versions");

/** Corrects a prescription that can no longer be edited: writes a new one for the same patient and marks the old one as replaced. */
export const replacePrescription = async (id: number | string, input: PrescriptionInput) =>
	unwrap<Prescription>(await apiPost(`/prescriptions/${id}/replace`, input), "Failed to save the corrected prescription");

export const searchMedicines = async (q: string) =>
	unwrap<MedicineSuggestion[]>(await apiGet(buildUrl("/prescriptions/medicines", { q })), "Failed to search medicines");
