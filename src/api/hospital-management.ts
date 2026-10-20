import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";
import { fetchDoctors } from "@/api/doctors";
import { fetchDoctorWorkplaces } from "@/api/workplaces";
import { HospitalAmenity, HospitalTest, Tag } from "@/types/hospitals";

/** Writes for a hospital's amenities, medical tests, doctors (workplaces) and tags. */

const unwrap = <T>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

// ---- Amenities (create/update/delete-hospital-amenity) ----

export interface AmenityInput {
	type: string;
	name: string;
	price: number;
	quantity: number;
	available: number;
	isActive: boolean;
}

export const createAmenity = async (hospitalId: number, input: AmenityInput) =>
	unwrap<HospitalAmenity>(await apiPost(`/hospitals/${hospitalId}/amenities`, input), "Failed to add amenity");

export const updateAmenity = async (hospitalId: number, id: number, input: AmenityInput) =>
	unwrap<HospitalAmenity>(await apiPut(`/hospitals/${hospitalId}/amenities/${id}`, input), "Failed to update amenity");

export const deleteAmenity = async (hospitalId: number, id: number) =>
	unwrap(await apiDelete(`/hospitals/${hospitalId}/amenities/${id}`), "Failed to delete amenity");

// ---- Medical tests (create/update/delete-hospital-medical-test) ----

export interface HospitalTestInput {
	medicalTestId: number;
	testCode?: string;
	price: number;
	processingTimeMinutes?: number;
	isAvailable: boolean;
	isActive: boolean;
}

export const createHospitalTest = async (hospitalId: number, input: HospitalTestInput) =>
	unwrap<HospitalTest>(await apiPost(`/hospitals/${hospitalId}/medical-tests`, input), "Failed to add medical test");

export const updateHospitalTest = async (hospitalId: number, id: number, input: HospitalTestInput) =>
	unwrap<HospitalTest>(
		await apiPut(`/hospitals/${hospitalId}/medical-tests/${id}`, input),
		"Failed to update medical test"
	);

export const deleteHospitalTest = async (hospitalId: number, id: number) =>
	unwrap(await apiDelete(`/hospitals/${hospitalId}/medical-tests/${id}`), "Failed to delete medical test");

// ---- Tags (update-hospital) ----

interface TagPage {
	content?: Tag[];
}

/** The tag catalogue is small (a couple of hundred), so it is loaded once. Needs a login. */
export const fetchAllTags = async (): Promise<Tag[]> => {
	const page = unwrap<TagPage>(await apiGet<TagPage>("/tags?size=500&sort=name"), "Failed to load tags");
	return page.content ?? [];
};

export const saveHospitalTags = async (hospitalId: number, tagIds: number[]) =>
	unwrap(await apiPut(`/hospitals/${hospitalId}/tags`, { tagIds }), "Failed to save tags");

// ---- Doctors: a doctor is linked to a hospital through a workplace ----

export const searchDoctorsByName = async (name: string) => {
	const page = await fetchDoctors({ name, page: 1, size: 8 });
	return page.content;
};

export const addDoctorToHospital = async (
	doctorId: number,
	input: { hospitalId: number; medicalSpecialityId?: number; doctorPosition?: string }
) => unwrap(await apiPost(`/doctors/${doctorId}/workplaces`, { doctorId, ...input }), "Failed to add doctor");

/** Removes every workplace the doctor has at this hospital (there is normally one). */
export const removeDoctorFromHospital = async (doctorId: number, hospitalId: number) => {
	const workplaces = await fetchDoctorWorkplaces(doctorId);
	const here = workplaces.filter((w) => w.hospital?.id === hospitalId);
	if (here.length === 0) throw new Error("This doctor has no workplace at this hospital");
	for (const workplace of here) {
		unwrap(await apiDelete(`/doctors/${doctorId}/workplaces/${workplace.id}`), "Failed to remove doctor");
	}
};
