import { baseUrl } from "@/config/config";
import type { DoctorDetailsResponse } from "@/types/doctors";
import type { HospitalDetailsResponse } from "@/types/hospitals";

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
	const response = await fetch(`${baseUrl}${path}`, {
		headers: { Accept: "application/json" },
		next: { revalidate: REVALIDATE_SECONDS },
	});
	if (response.status === 404 || response.status === 400) return null;
	if (!response.ok) throw new Error(`Directory request failed (${response.status})`);
	return (await response.json()) as T;
}

export async function getHospital(id: string): Promise<HospitalDetailsResponse | null> {
	const numeric = parseId(id);
	if (numeric == null) return null;
	return getJson(`/hospitals/${numeric}?doctors=true&tests=true&amenities=true`);
}

export async function getDoctor(id: string): Promise<DoctorDetailsResponse | null> {
	const numeric = parseId(id);
	if (numeric == null) return null;
	return getJson(`/doctors/${numeric}?degrees=true&workplaces=true&associations=true`);
}

/** Only http(s) links are rendered; anything else (javascript:, data:) is dropped. */
export function safeUrl(url?: string | null): string | null {
	const value = url?.trim();
	if (!value) return null;
	const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
	try {
		const parsed = new URL(withProtocol);
		return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
	} catch {
		return null;
	}
}

export function validEmail(email?: string | null): string | null {
	const value = email?.trim();
	return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : null;
}
