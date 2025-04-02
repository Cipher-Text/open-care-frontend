// Update the Doctor type to match your API response
export interface Doctor {
	id: number;
	name: string;
	bnName: string;
	gender: string;
	bmdcNo: string;
	phone: string | null;
	email: string | null;
	address: string | null;
	yearOfExperience: number;
	description: string | null;
	image: string | null;
	startDate: string | null;
	isActive: boolean;
	userId: number | null;
}

export interface DoctorResponse {
	totalItems: number;
	doctors: Doctor[];
}

export interface Division {
	id: number;
	name: string;
	bnName: string;
	url: string | null;
}

export interface District {
	id: number;
	division: Division;
	name: string;
	bnName: string;
	lat: string;
	lon: string;
	url: string;
}

export interface Upazila {
	id: number;
	district: District;
	name: string;
	bnName: string;
	url: string | null;
}

export interface Union {
	id: number;
	upazila: Upazila;
	name: string;
	bnName: string;
	url: string | null;
}

export interface Hospital {
	id: number;
	name: string;
	bnName: string | null;
	numberOfBed: number;
	district: District;
	upazila: Upazila | null;
	union: Union | null;
	hospitalType: string; // "GENERAL", "CANCER", "CHEST_DISEASE"
	organizationType: string; // "GOVERNMENT", "MILITARY", "PRIVATE"
	lat: string | null;
	lon: string | null;
	url: string | null;
}

export interface HospitalResponse {
	hospitals: Hospital[];
	currentPage: number;
	totalPages: number;
	totalItems: number;
}

export interface OrganizationType {
	name: string;
	bnName: string;
}

export interface HospitalType {
	name: string;
	bnName: string;
}

export interface Institute {
	id: number;
	name: string;
	bnName: string | null;
	numberOfBed: number;
	district: District;
	upazila: Upazila | null;
	union: Union | null;
	hospitalType: string;
	organizationType: string;
	lat: string | null;
	lon: string | null;
	url: string | null;
}

export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	image?: string;
}

export interface BlogPost {
	id: number;
	title: string;
	image: string;
	category: string;
	description: string;
}

export interface FeaturedData {
	doctors: Doctor[];
	hospitals: Hospital[];
	institutes: Institute[];
	stats: {
		totalDoctors: number;
		totalHospitals: number;
		totalInstitutes: number;
		totalPatientsCared: number;
	};
}

export interface InstitutionResponse {
	institutions: Institute[];
	currentPage: number;
	totalPages: number;
	totalItems: number;
}
