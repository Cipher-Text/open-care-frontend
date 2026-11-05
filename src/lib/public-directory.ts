import { fetchWithTimeout } from "@/lib/http";
import { baseUrl } from "@/config/config";
import type { DoctorDetailsResponse } from "@/types/doctors";
import type { HospitalDetailsResponse } from "@/types/hospitals";
import type { NurseResponse } from "@/types/nurses";
import type { NutritionistDegree, NutritionistResponse } from "@/types/nutritionists";
import { displayName } from "@/lib/text";
export { safeUrl } from "@/lib/safe-url";

/**
 * Server-side reads for the public detail pages. Both endpoints are public, so no token is
 * sent, and Next caches each response for ten minutes. A missing record returns null (the page
 * shows a 404); any other failure throws so the route's error state is shown instead.
 */
const REVALIDATE_SECONDS = 10 * 60;

function parseId(id: string): number | null {
	return /^\d{1,12}$/.test(id) ? Number(id) : null;
}

async function getJson<T>(path: string): Promise<T | null> {
	const response = await fetchWithTimeout(`${baseUrl}${path}`, {
		headers: { Accept: "application/json" },
		next: { revalidate: REVALIDATE_SECONDS },
	});
	if (response.status === 404 || response.status === 400) return null;
	if (!response.ok) throw new Error(`Directory request failed (${response.status})`);
	return (await response.json()) as T;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A page's route segment is a slug; an all-digit segment may also be a legacy id (see the detail routes). */
export function isLegacyId(segment: string): boolean {
	return parseId(segment) != null;
}

async function getBySegment<T extends { slug?: string | null }>(kind: "hospitals" | "doctors", segment: string, include: string) {
	const value = decodeURIComponent(segment);
	const numeric = parseId(value);
	if (numeric != null) {
		const byId = await getJson<T>(`/${kind}/${numeric}?${include}`);
		if (byId) return byId;
	}
	if (!SLUG_PATTERN.test(value)) return null;
	return getJson<T>(`/${kind}/slug/${value}?${include}`);
}

export async function getHospital(segment: string): Promise<HospitalDetailsResponse | null> {
	const hospital = await getBySegment<HospitalDetailsResponse>("hospitals", segment, "doctors=true&tests=true&amenities=true");
	if (hospital) {
		hospital.name = displayName(hospital.name);
		hospital.bnName = displayName(hospital.bnName);
		for (const doctor of hospital.doctors ?? []) {
			if (doctor?.profile) doctor.profile.name = displayName(doctor.profile.name);
		}
	}
	return hospital;
}

export async function getDoctor(segment: string): Promise<DoctorDetailsResponse | null> {
	const doctor = await getBySegment<DoctorDetailsResponse>("doctors", segment, "degrees=true&workplaces=true&associations=true");
	if (doctor?.profile) {
		doctor.profile.name = displayName(doctor.profile.name);
		doctor.profile.bnName = displayName(doctor.profile.bnName);
	}
	return doctor;
}

/** One nurse by id (nurses have no slug). A missing or inactive nurse is null, so the page shows a 404. */
export async function getNurse(segment: string): Promise<NurseResponse | null> {
	const id = parseId(decodeURIComponent(segment));
	if (id == null) return null;
	const nurse = await getJson<NurseResponse>(`/nurses/${id}`);
	if (!nurse || nurse.isActive === false) return null;
	if (nurse.profile) {
		nurse.profile.name = displayName(nurse.profile.name);
		nurse.profile.bnName = displayName(nurse.profile.bnName);
	}
	return nurse;
}

/** One nutritionist by id. A missing or inactive record is null, so the page shows a 404. */
export async function getNutritionist(segment: string): Promise<NutritionistResponse | null> {
	const id = parseId(decodeURIComponent(segment));
	if (id == null) return null;
	const nutritionist = await getJson<NutritionistResponse>(`/nutritionists/${id}`);
	if (!nutritionist || nutritionist.isActive === false) return null;
	if (nutritionist.profile) {
		nutritionist.profile.name = displayName(nutritionist.profile.name);
		nutritionist.profile.bnName = displayName(nutritionist.profile.bnName);
	}
	return nutritionist;
}

/** The degrees of a nutritionist, newest first. A failure is an empty list: the page then shows the one-line summary. */
export async function getNutritionistDegrees(id: number): Promise<NutritionistDegree[]> {
	return (await getJson<NutritionistDegree[]>(`/nutritionists/${id}/degrees`).catch(() => null)) ?? [];
}

export function validEmail(email?: string | null): string | null {
	const value = email?.trim();
	return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}

const PLACEHOLDERS = new Set(["not available", "n/a", "na", "none", "null", "-", "--"]);

/** The data has "Not Available" and similar placeholders in text fields; show nothing instead. */
export function clean(value?: string | null): string | null {
	const text = value?.trim();
	return text && !PLACEHOLDERS.has(text.toLowerCase()) ? text : null;
}
