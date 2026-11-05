import { publicGet } from "@/lib/api-client";
import {
	DivisionResponse,
	DistrictResponse,
	UpazilaResponse,
	UnionResponse,
} from "@/types/locations";

export const fetchDivisions = async (): Promise<DivisionResponse> => {
	const data = await publicGet(`/divisions`);
	return data;
};

export const fetchDistricts = async (): Promise<DistrictResponse> => {
	const data = await publicGet(`/districts`);
	return data;
};

export const fetchUpazilas = async (): Promise<UpazilaResponse> => {
	const data = await publicGet(`/upazilas`);
	return data;
};

export const fetchUnionsByUpazila = async (
	upazilaId: string | number
): Promise<UnionResponse> => {
	const data = await publicGet(`/upazilas/${upazilaId}/unions`);
	return data;
};

export const fetchUpazilasByDistrict = async (
	districtId: number
): Promise<UpazilaResponse> => {
	const data = await publicGet(`/districts/${districtId}/upazilas`);
	return data;
};
