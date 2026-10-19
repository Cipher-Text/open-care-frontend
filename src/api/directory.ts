import { apiGet, buildUrl } from "@/lib/api-client";
import { Hospital } from "@/types/hospitals";
import { DoctorResponse } from "@/types/doctors";
import { District } from "@/types/locations";
import { MedicalSpeciality } from "@/types/doctors";
import { ICommonEnum } from "@/types/common";

/**
 * Public directory fetchers. Every endpoint used here is a public GET on the
 * backend, so no auth header is sent (an expired token must not break browsing).
 * Pages are 0-based on the wire; callers pass 1-based pages and we convert.
 */

export interface PageResult<T> {
	content: T[];
	currentPage: number;
	totalItems: number;
	totalPages: number;
}

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

export const fetchPublicHospitals = ({ page, ...rest }: HospitalQuery) =>
	getPublic<PageResult<Hospital>>("/hospitals", {
		...rest,
		page: page - 1,
	});

export interface DoctorQuery {
	name?: string;
	districtId?: string;
	specialityId?: string;
	page: number;
	size: number;
}

export const fetchPublicDoctors = ({ page, ...rest }: DoctorQuery) =>
	getPublic<PageResult<DoctorResponse>>("/doctors", {
		...rest,
		page: page - 1,
	});

export const fetchDistrictOptions = () => getPublic<District[]>("/districts");

export const fetchSpecialityOptions = () =>
	getPublic<MedicalSpeciality[]>("/medical-specialities/all");

export const fetchHospitalTypeOptions = () =>
	getPublic<ICommonEnum[]>("/hospital-types");

export const fetchOrganizationTypeOptions = () =>
	getPublic<ICommonEnum[]>("/organization-types");
