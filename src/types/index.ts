import { ReactNode } from "react";

export interface Profile {
	id: number;
	name: string;
	bnName: string;
	gender: string;
	dateOfBirth: string | null;
	address: string | null;
	phone: string | null;
	email: string | null;
	photo: string | null;
	username: string | null;
	userType: string;
	keycloakUserId: string | null;
	district: District | null;
	upazila: Upazila | null;
	union: Union | null;
}

export interface User {
	id: number;
	username: string;
	userType: string;
	image?: string;
	keycloakUserId: string;
	photo: string | null;
	phone: string;
	email: string;
	name: string;
	bnName: string;
	gender: string;
	bloodGroup: string;
	dateOfBirth: string | null;
	address: string | null;
	district: District;
	upazila: Upazila | null;
	union: Union | null;
}

export interface Degree {
	id: number;
	name: string;
	abbreviation: string;
	degreeType: string;
}

export interface MedicalSpeciality {
	id: number;
	parentId: number | null;
	name: string;
	bnName: string;
	description: string | null;
}

export interface DoctorDegree {
	institute: ReactNode;
	year: ReactNode;
	id: number;
	doctor: Doctor;
	degree: Degree;
	medicalSpeciality: MedicalSpeciality | null;
	institution: Institution | null;
	startDateTime: string | null;
	endDateTime: string | null;
	grade: string | null;
	description: string | null;
}

export interface DoctorWorkplace {
	designation: ReactNode;
	department: ReactNode;
	id: number;
	doctor: Doctor;
	doctorPosition: string | null;
	teacherPosition: string | null;
	medicalSpeciality: MedicalSpeciality | null;
	institution: Institution | null;
	hospital: Hospital | null;
	startDate: string | null;
	endDate: string | null;
}

export interface Doctor {
	id: number;
	bmdcNo: string;
	yearOfExperience?: number;
	startDate: string | null;
	degrees: string | null;
	specializations: string | null;
	description: string | null;
	isActive: boolean;
	isDeleted: boolean | null;
	profile: Profile;
	doctorDegrees: DoctorDegree[] | null;
	doctorWorkplaces: DoctorWorkplace[] | null;
}

export interface DoctorResponse {
	totalItems: number;
	doctors: Doctor[];
	totalPages: number;
	currentPage: number;
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

export interface HospitalType {
	banglaName: string;
	englishName: string;
}

export interface OrganizationType {
	name: string;
	banglaName: string;
	description: string;
}

export interface Hospital {
	id: number;
	name: string;
	bnName: string;
	numberOfBed: number;
	imageUrl: string | null;
	address: string | null;
	district: District | null;
	upazila: Upazila | null;
	union: Union | null;
	hospitalType: HospitalType;
	organizationType: OrganizationType;
	lat: string | null;
	lon: string | null;
	websiteUrl: string;
	email: string | null;
	phone: string | null;
	description?: string | null;
	services?: HospitalService[];
	facilities?: HospitalFacility[];
}

export interface HospitalService {
	name: string;
	description: string;
}

export interface HospitalFacility {
	name: string;
	description: string;
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

export interface MedicalTest {
	id: number;
	parentId: number | null;
	name: string;
	bnName: string;
	alternativeNames: string | null;
	description: string | null;
}

export interface HospitalMedicalTest {
	id: number;
	hospital: Hospital;
	medicalTest: MedicalTest;
	price: number;
	isActive: boolean;
	discountPercent?: number;
}

export interface HospitalMedicalTestResponse {
	totalItems: number;
	totalPages: number;
	hospitalMedicalTests: HospitalMedicalTest[];
	currentPage: number;
	tests?: HospitalMedicalTest[];
}

export interface Institution {
	id: number;
	acronym: string | null;
	establishedYear: string | null;
	enroll: number | null;
	name: string;
	bnName: string | null;
	numberOfBed: number;
	district: District;
	upazila: Upazila | null;
	union: Union | null;
	hospitalType: HospitalType;
	organizationType: OrganizationType;
	lat: string | null;
	lon: string | null;
	websiteUrl: string;
	description?: string | null;
	imageUrl?: string | null;
}

export interface InstitutionResponse {
	institutions: Institution[];
	currentPage: number;
	totalPages: number;
	totalItems: number;
}

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   image?: string;
// }

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
	institutions: Institution[];
	stats: {
		totalDoctors: number;
		totalHospitals: number;
		totalInstitutions: number;
		totalPatientsCared: number;
	};
}

// GitHub contributor interface
export interface GitHubContributor {
	id: number;
	login: string;
	avatar_url: string;
	html_url: string;
	contributions: number;
	name?: string;
	bio?: string;
	email?: string;
	blog?: string; // Often contains LinkedIn or personal website
	location?: string;
}

// Developer interface with GitHub data
export interface Developer {
	id: number;
	name: string;
	login: string;
	role: string;
	avatar: string;
	bio: string;
	contributions: number;
	githubUrl: string;
	email?: string;
	linkedin?: string;
	location?: string;
}
