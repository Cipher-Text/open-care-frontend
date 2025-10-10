import { Division, District, Upazila } from "./locations";
import { MedicalSpeciality } from "./medical-specialities";

export interface AssociationType {
  value: string | null;
  displayName: string | null;
  bnName: string;
}

export interface OriginCountry {
  value: string | null;
  displayNameEn: string | null;
  nameBn: string;
  nameNative: string;
  acronym: string;
}

export interface Domain {
  value: string | null;
  displayName: string | null;
  banglaName: string;
  isAdvertisement: boolean;
}

export interface UserType {
  value: string | null;
  displayName: string | null;
  banglaName: string;
  keycloakGroupName: string;
  description: string;
}

export interface Gender {
  value: string | null;
  displayName: string | null;
  banglaName: string;
}

export interface BloodGroup {
  value: string | null;
  displayName: string | null;
  bnName: string | null;
}

export interface DoctorProfile {
  id: number;
  username: string | null;
  userType: UserType;
  keycloakUserId: string | null;
  photo: string | null;
  phone: string | null;
  email: string | null;
  name: string;
  bnName: string;
  gender: Gender;
  dateOfBirth: string | null;
  bloodGroup: BloodGroup;
  address: string | null;
  district: District | null;
  upazila: Upazila | null;
  union: unknown | null;
}

export interface Doctor {
  id: number;
  bmdcNo: string;
  startDate: string | null;
  yearOfExperience: number | null;
  degrees: unknown | null;
  specializations: unknown | null;
  description: string | null;
  isActive: boolean;
  isVerified: boolean;
  profile: DoctorProfile;
  doctorDegrees: unknown | null;
  doctorWorkplaces: unknown | null;
  doctorAssociations: unknown | null;
  tags: unknown[];
}

export interface MembershipType {
  value: string | null;
  displayName: string;
}

export interface DoctorAssociation {
  id: number;
  doctor: Doctor;
  association: Association;
  membershipType: MembershipType;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

export interface AssociationType {
  value: string | null;
  displayName: string | null;
  bnName: string;
}

export interface OriginCountry {
  value: string | null;
  displayNameEn: string | null;
  nameBn: string;
  nameNative: string;
  acronym: string;
}

export interface Association {
  id: number;
  name: string;
  bnName: string;
  shortName: string;
  associationType: AssociationType;
  medicalSpeciality: MedicalSpeciality;
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
  originCountry: OriginCountry;
  domain: Domain;
  doctorAssociations?: DoctorAssociation[];
}

export interface AssociationsListResponse {
  associations: Association[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message?: string;
  status?: number;
}
