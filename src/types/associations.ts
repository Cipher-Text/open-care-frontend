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
}

export interface AssociationsListResponse {
  associations: Association[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message?: string;
  status?: number;
}
