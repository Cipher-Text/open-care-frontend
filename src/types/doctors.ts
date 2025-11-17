import { District, Division, Union, Upazila } from "./locations";
import { Sort, Pageable } from "./common";

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

export type AddDoctorDegreeRequest = {
	doctorId: number;
	degreeId: number;
	medicalSpecialityId: number;
	institutionId: number;
	startDate: string;
	endDate: string;
	grade: string;
	description: string;
	endDateValid: boolean;
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
	hospitalType:
		| {
				value: string | null;
				banglaName: string;
				englishName: string;
		  }
		| string;
	organizationType:
		| {
				value: string | null;
				displayName: string | null;
				banglaName: string;
				description: string;
		  }
		| string;
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
	doctorAssociations?: DoctorAssociation[];
	tags?: string[];
};

export type DoctorDetailsResponse = {
	id: number;
	bmdcNo: string;
	startDate: string | null;
	yearOfExperience: number | null;
	degrees: string | null;
	specializations: string | null;
	description: string | null;
	isActive: boolean;
	isVerified: boolean;
	profile: {
		id: number;
		username: string | null;
		userType: {
			value: string | null;
			displayName: string | null;
			banglaName: string;
			keycloakGroupName: string;
			description: string;
		};
		keycloakUserId: string | null;
		photo: string | null;
		phone: string | null;
		email: string | null;
		name: string;
		bnName: string;
		gender: {
			value: string | null;
			displayName: string | null;
			banglaName: string;
		};
		dateOfBirth: string | null;
		bloodGroup: string | null;
		address: string | null;
		district: District | null;
		upazila: Upazila | null;
		union: Union | null;
		isBloodDonor: boolean;
		bloodDonationCount: number | null;
		lastBloodDonationDate: string | null;
		isVolunteer: boolean;
		healthDataConsent: boolean;
		isActive: boolean;
		facebookProfileUrl: string | null;
		linkedinProfileUrl: string | null;
		researchGateProfileUrl: string | null;
		xprofileUrl: string | null;
	};
	doctorDegrees: {
		id: number;
		degree: {
			id: number;
			name: string;
			abbreviation: string;
			degreeType: {
				value: string | null;
				displayName: string | null;
				banglaName: string;
			};
		};
		medicalSpeciality: MedicalSpeciality | null;
		institution: Institution;
		startDate: string | null;
		endDate: string | null;
		grade: string | null;
		description: string | null;
	}[];
	doctorWorkplaces: {
		id: number;
		doctorPosition: string;
		teacherPosition: string | null;
		medicalSpeciality: MedicalSpeciality;
		institution: Institution | null;
		hospital: Hospital;
		startDate: string | null;
		endDate: string | null;
	}[];
	doctorAssociations: {
		id: number;
		association: {
			id: number;
			name: string;
			bnName: string;
			shortName: string;
			associationType: {
				value: string | null;
				displayName: string | null;
				bnName: string;
			};
			medicalSpeciality: MedicalSpeciality | null;
			description: string | null;
			logoUrl: string | null;
			foundedDate: string | null;
			websiteUrl: string | null;
			facebookUrl: string | null;
			twitterUrl: string | null;
			linkedinUrl: string | null;
			youtubeUrl: string | null;
			email: string | null;
			phone: string | null;
			divisionId: number | null;
			division: Division;
			districtId: number | null;
			district: District;
			upazilaId: number | null;
			upazila: Upazila | null;
			originCountry: {
				value: string | null;
				displayNameEn: string | null;
				nameBn: string;
				nameNative: string;
				acronym: string;
			};
			domain: {
				value: string | null;
				displayName: string | null;
				banglaName: string;
				isAdvertisement: boolean;
			};
		};
		membershipType: {
			value: string | null;
			displayName: string;
		};
		startDate: string;
		endDate: string | null;
		isActive: boolean;
	}[];
	tags: string[];
};

export interface DoctorListResponse {
	doctors: DoctorResponse[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
	message: string;
	status: number;
}

export interface DoctorDegreesListResponse {
	totalElements: number;
	totalPages: number;
	pageable: Pageable;
	numberOfElements: number;
	first: boolean;
	last: boolean;
	size: number;
	content: DoctorDegree[];
	number: number;
	sort: Sort;
	empty: boolean;
}
