import { District, Union, Upazila } from "./locations";

export type Hospital = {
	id: number;
	name: string;
	bnName: string;
	numberOfBed: number;
	district: District;
	upazila: Upazila;
	union: Union;
	hospitalType: string;
	organizationType: string;
	lat: string;
	lon: string;
	websiteUrl: string;
	createdBy?: string;
	updatedBy?: string;
	createdAt?: string;
	updatedAt?: string;
};

export interface HospitalListResponse {
	hospitals: Hospital[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
	message: string;
	status: number;
}
