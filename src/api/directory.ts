import { apiGet, buildUrl } from "@/lib/api-client";
import { Hospital } from "@/types/hospitals";
import { DoctorResponse } from "@/types/doctors";
import { District } from "@/types/locations";
import { MedicalSpeciality } from "@/types/doctors";
import { ICommonEnum, PageResult } from "@/types/common";
import { normalizePage, toWirePage, type WirePage } from "@/lib/pagination";

/**
 * Public directory fetchers. Every endpoint used here is a public GET on the
 * backend, so no auth header is sent (an expired token must not break browsing).
 * Callers pass 1-based pages; lib/pagination.ts converts to and from the API.
 */


async function getPublic<T>(path: string, params?: Record<string, unknown>) {
	const response = await apiGet<T>(buildUrl(path, params), {
		includeAuth: false,
	});
	if (!response.ok) {
		throw new Error(response.error || `Request failed (${response.status})`);
	}
	return response.data as T;
}

export interface HospitalQuery {
	name?: string;
	districtId?: string;
	hospitalTypes?: string;
	organizationType?: string;
	hasEmergencyService?: boolean;
	hasAmbulanceService?: boolean;
	hasBloodBank?: boolean;
	sortBy?: string;
	sortDir?: "ASC" | "DESC";
	page: number;
	size: number;
}

export const fetchPublicHospitals = async ({
	page,
	...rest
}: HospitalQuery): Promise<PageResult<Hospital>> =>
	normalizePage(
		await getPublic<WirePage<Hospital>>("/hospitals", {
			...rest,
			page: toWirePage(page),
		})
	);

export interface DoctorQuery {
	name?: string;
	districtId?: string;
	specialityId?: string;
	page: number;
	size: number;
}

export const fetchPublicDoctors = async ({
	page,
	...rest
}: DoctorQuery): Promise<PageResult<DoctorResponse>> =>
	normalizePage(
		await getPublic<WirePage<DoctorResponse>>("/doctors", {
			...rest,
			page: toWirePage(page),
		})
	);

export const fetchDistrictOptions = () => getPublic<District[]>("/districts");

export const fetchSpecialityOptions = () =>
	getPublic<MedicalSpeciality[]>("/medical-specialities/all");

export const fetchHospitalTypeOptions = () =>
	getPublic<ICommonEnum[]>("/hospital-types");

export const fetchOrganizationTypeOptions = () =>
	getPublic<ICommonEnum[]>("/organization-types");

// ---- Ambulances and institutions (public lists) ----

export interface PublicAmbulance {
	id: number;
	vehicleNumber: string;
	type: { value: string; description: string } | null;
	driverName: string | null;
	driverPhone: string | null;
	isAvailable: boolean;
	isAffiliated: boolean;
	hospital: { id: number; name: string } | null;
	upazila: { id: number; name: string } | null;
	district: { id: number; name: string } | null;
}

export interface AmbulanceQuery {
	districtId?: string;
	type?: string;
	isAvailable?: boolean;
	page: number;
	size: number;
}

export const fetchPublicAmbulances = async ({
	page,
	...rest
}: AmbulanceQuery): Promise<PageResult<PublicAmbulance>> =>
	normalizePage(
		await getPublic<WirePage<PublicAmbulance>>("/ambulances", {
			...rest,
			sort: "id",
			direction: "DESC",
			page: toWirePage(page),
		})
	);

export interface PublicInstitution {
	id: number;
	acronym: string | null;
	name: string;
	bnName: string | null;
	establishedYear: number | null;
	enroll: number | null;
	websiteUrl: string | null;
	district: { id: number; name: string } | null;
	upazila: { id: number; name: string } | null;
	institutionType: { value: string; englishName: string } | null;
	organizationType: { value: string; displayName: string } | null;
}

export interface InstitutionQuery {
	name?: string;
	districtId?: string;
	organizationType?: string;
	page: number;
	size: number;
}

export const fetchPublicInstitutions = async ({
	page,
	...rest
}: InstitutionQuery): Promise<PageResult<PublicInstitution>> =>
	normalizePage(
		await getPublic<WirePage<PublicInstitution>>("/institutions", {
			...rest,
			page: toWirePage(page),
		})
	);

export const fetchAmbulanceTypeOptions = () =>
	getPublic<{ value: string; description: string }[]>("/ambulance-types");
