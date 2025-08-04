import { District, Division, Union, Upazila } from "./locations";

export type Profile = {
	id: number;
	username: string;
	userType: string;
	keycloakUserId: string;
	photo?: string;
	imageUrl?: string;
	phone: string;
	email: string;
	name: string;
	bnName: string;
	gender: string;
	dateOfBirth: string;
	bloodGroup: string;
	address: string;
	district: District;
	upazila: Upazila;
	union: Union;
	createdBy?: string;
	updatedBy?: string;
	createdAt?: string;
	updatedAt?: string;
	facebookProfileUrl?: string;
	linkedinProfileUrl?: string;
	researchGateProfileUrl?: string;
	contributionPoints?: number;
	isBloodDonor?: boolean;
	bloodDonationCount?: number;
	lastBloodDonationDate?: string;
	isVolunteer?: boolean;
	isActive?: boolean;
	xprofileUrl?: string;
};

export type Degree = {
	id: number;
	name: string;
	abbreviation: string;
	degreeType: string;
};

export type MedicalSpeciality = {
	id: number;
	parentId: number;
	name: string;
	bnName: string;
	icon: string;
	imageUrl: string;
	description: string;
	doctorCount?: number;
};

export type Institution = {
	createdBy?: string;
	updatedBy?: string;
	createdAt?: string;
	updatedAt?: string;
	id: number;
	acronym?: string;
	name: string;
	bnName: string;
	imageUrl?: string;
	establishedYear?: number;
	enroll?: number;
	district: District;
	hospitalType?: string;
	organizationType?: string;
	lat?: string;
	lon?: string;
	websiteUrl?: string;
};

export type DoctorDegree = {
	id: number;
	doctor: string;
	degree: Degree;
	medicalSpeciality: MedicalSpeciality;
	institution: Institution;
	startDateTime: string;
	endDateTime: string;
	grade: string;
	description: string;
};

export type Association = {
	createdBy?: string;
	updatedBy?: string;
	createdAt?: string;
	updatedAt?: string;
	id: number;
	name: string;
	bnName: string;
	shortName: string;
	associationType: string;
	medicalSpeciality: MedicalSpeciality;
	description: string;
	logoUrl: string;
	foundedDate: string;
	websiteUrl: string;
	facebookUrl: string;
	twitterUrl: string;
	linkedinUrl: string;
	youtubeUrl: string;
	email: string;
	phone: string;
	division: Division;
	district: District;
	upazila: Upazila;
	originCountry: string;
};

export type DoctorProfile = {
	createdBy?: string;
	updatedBy?: string;
	createdAt?: string;
	updatedAt?: string;
	id: number;
	userType: string;
	username: string;
	keycloakUserId: string;
	imageUrl?: string;
	phone: string;
	email: string;
	name: string;
	bnName: string;
	gender: string;
	dateOfBirth: string;
	bloodGroup: string;
	address: string;
	facebookProfileUrl?: string;
	linkedinProfileUrl?: string;
	researchGateProfileUrl?: string;
	district: District;
	upazila: Upazila;
	union: Union;
	contributionPoints?: number;
	isBloodDonor?: boolean;
	bloodDonationCount?: number;
	lastBloodDonationDate?: string;
	isVolunteer?: boolean;
	isActive?: boolean;
	xprofileUrl?: string;
};

export type DoctorAssociation = Association;

export type Doctor = {
	createdBy?: string;
	updatedBy?: string;
	createdAt?: string;
	updatedAt?: string;
	id: number;
	bmdcNo: string;
	degrees: string;
	specializations: string;
	startDate: string;
	description: string;
	isVerified: boolean;
	isActive: boolean;
	profile: DoctorProfile;
	associations?: DoctorAssociation[];
};

export type Hospital = {
	id: number;
	name: string;
	bnName: string;
	numberOfBed?: number;
	district: District;
	upazila: Upazila;
	union: Union;
	hospitalType: string;
	organizationType: string;
	lat: string;
	lon: string;
	websiteUrl: string;
};

export type DoctorWorkplace = {
	id: number;
	doctor: Doctor;
	doctorPosition: string;
	teacherPosition: string;
	medicalSpeciality: MedicalSpeciality;
	institution: Institution;
	hospital: Hospital;
	startDate: string;
	endDate: string;
};

export type DoctorResponse = {
	id: number;
	bmdcNo: string;
	startDate: string;
	yearOfExperience: number;
	degrees: string;
	specializations: string;
	description: string;
	isActive: boolean;
	isVerified: boolean;
	profile: Profile;
	doctorDegrees: DoctorDegree[];
	doctorWorkplaces: DoctorWorkplace[];
};

export interface DoctorListResponse {
	doctors: DoctorResponse[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
	message: string;
	status: number;
}
