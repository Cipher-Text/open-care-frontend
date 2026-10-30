import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";

export type DayOfWeek = "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
export type ScheduleActivity = "PATIENT_VISIT" | "TEACHING" | "OPERATION" | "RESEARCH" | "ADMINISTRATIVE";
export type ScheduleMode = "ONLINE" | "OFFLINE" | "BOTH";

export interface ScheduleBlock {
	id: number;
	doctorId: number;
	doctorWorkplaceId: number | null;
	workplaceName: string | null;
	dayOfWeek: DayOfWeek;
	/** "HH:mm:ss" */
	startTime: string;
	endTime: string;
	activityType: ScheduleActivity;
	appointmentType: ScheduleMode | null;
	isBookable: boolean;
	slotDurationMinutes: number | null;
	consultationFee: number | null;
	maxSlotsPerSession: number | null;
	activityDescription: string | null;
	department: string | null;
	effectiveFrom: string;
	effectiveTo: string | null;
	isActive: boolean;
}

export type ScheduleInput = Partial<Omit<ScheduleBlock, "id" | "doctorId" | "workplaceName" | "isBookable" | "isActive">> & {
	dayOfWeek: DayOfWeek;
	startTime: string;
	endTime: string;
	activityType: ScheduleActivity;
	isBookable?: boolean;
	isActive?: boolean;
};

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

export const fetchSchedule = async (doctorId: number | string) =>
	unwrap<ScheduleBlock[]>(await apiGet(`/doctors/${doctorId}/schedules`), "Could not load the schedule");

export const addScheduleBlock = async (doctorId: number | string, body: ScheduleInput) =>
	unwrap<ScheduleBlock>(await apiPost(`/doctors/${doctorId}/schedules`, body), "Could not add the block");

export const updateScheduleBlock = async (doctorId: number | string, id: number, body: ScheduleInput) =>
	unwrap<ScheduleBlock>(await apiPut(`/doctors/${doctorId}/schedules/${id}`, body), "Could not save the block");

export const deleteScheduleBlock = async (doctorId: number | string, id: number) => {
	const response = await apiDelete(`/doctors/${doctorId}/schedules/${id}`);
	if (!response.ok) throw new Error(response.error || "Could not remove the block");
};

// ---- time off

export interface TimeOff {
	id: number;
	date: string;
	startTime: string | null;
	endTime: string | null;
	wholeDay: boolean;
	reason: string | null;
}

export const fetchTimeOff = async (doctorId: number | string) =>
	unwrap<TimeOff[]>(await apiGet(`/doctors/${doctorId}/schedules/exceptions`), "Could not load your time off");

/** `cancelBookings` cancels the visits already booked in that time and tells the patients; without it the call fails while there are any. */
export const addTimeOff = async (
	doctorId: number | string,
	body: { date: string; startTime?: string; endTime?: string; reason?: string; cancelBookings?: boolean }
) => unwrap<TimeOff>(await apiPost(`/doctors/${doctorId}/schedules/exceptions`, body), "Could not add the time off");

export const removeTimeOff = async (doctorId: number | string, id: number) => {
	const response = await apiDelete(`/doctors/${doctorId}/schedules/exceptions/${id}`);
	if (!response.ok) throw new Error(response.error || "Could not remove the time off");
};
