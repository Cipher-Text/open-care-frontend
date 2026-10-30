import { apiGet, apiPatch, apiPost, buildUrl } from "@/lib/api-client";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";
import type { PageResult } from "@/types/common";

export type AppointmentStatus = "REQUESTED" | "CONFIRMED" | "DECLINED" | "EXPIRED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export interface Slot {
	date: string;
	startTime: string;
	endTime: string;
	durationMinutes: number;
	fee: number | null;
}

export interface SlotList {
	bookable: boolean;
	message: string | null;
	slots: Slot[];
}

export interface Appointment {
	id: number;
	number: string;
	status: AppointmentStatus;
	date: string;
	startTime: string;
	endTime: string;
	fee: number | null;
	doctorId: number;
	/** The patient's view has the doctor, the doctor's view has the patient. */
	doctorName: string | null;
	doctorSlug: string | null;
	patientName: string | null;
	patientPhone: string | null;
	reason: string | null;
	cancellationReason: string | null;
	cancelledBy: string | null;
	heldUntil: string | null;
	createdAt: string;
}

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

/** The free slots of a verified doctor; public. */
export const fetchSlots = async (doctorId: number | string, days = 14): Promise<SlotList> => {
	const response = await apiGet<SlotList>(buildUrl(`/doctors/${doctorId}/slots`, { days }), { includeAuth: false });
	return unwrap(response, "Could not load the open times");
};

export const requestAppointment = async (body: { doctorId: number; date: string; startTime: string; reason?: string }) =>
	unwrap<Appointment>(await apiPost("/appointments", body), "Could not send your request");

export const fetchMyAppointments = async (page: number, size: number): Promise<PageResult<Appointment>> =>
	normalizePage(unwrap<WirePage<Appointment>>(await apiGet(buildUrl("/me/appointments", { page: toWirePage(page), size })), "Could not load your appointments"));

export const cancelMyAppointment = async (id: number, reason?: string) =>
	unwrap<Appointment>(await apiPatch(`/appointments/${id}/cancel`, reason ? { reason } : undefined), "Could not cancel");

// ---- the doctor

export const fetchDoctorAppointments = async (page: number, size: number, status?: string): Promise<PageResult<Appointment>> =>
	normalizePage(unwrap<WirePage<Appointment>>(await apiGet(buildUrl("/doctors/me/appointments", { page: toWirePage(page), size, status })), "Could not load the appointments"));

export const confirmAppointment = async (id: number) => unwrap<Appointment>(await apiPatch(`/appointments/${id}/confirm`), "Could not confirm");

export const declineAppointment = async (id: number, reason?: string) =>
	unwrap<Appointment>(await apiPatch(`/appointments/${id}/decline`, reason ? { reason } : undefined), "Could not decline");

export const cancelAsDoctor = async (id: number, reason: string) =>
	unwrap<Appointment>(await apiPatch(`/appointments/${id}/cancel-by-doctor`, { reason }), "Could not cancel");

export const completeAppointment = async (id: number) => unwrap<Appointment>(await apiPatch(`/appointments/${id}/complete`), "Could not close the visit");

export const markNoShow = async (id: number) => unwrap<Appointment>(await apiPatch(`/appointments/${id}/no-show`), "Could not close the visit");
