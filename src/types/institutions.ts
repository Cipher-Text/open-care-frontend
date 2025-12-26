import { District, Upazila, Union } from "./locations";

export interface Tag {
  id: number;
  name: string;
  displayName: string;
  category: string;
}

export interface Country {
  value: string;
  displayNameEn: string;
  nameBn: string;
  nameNative: string;
  acronym: string;
}

export interface InstitutionType {
  value: string;
  banglaName: string;
  englishName: string;
  description: string;
}

export interface OrganizationType {
  value: string;
  displayName: string;
  banglaName: string;
  description: string;
}

export interface HospitalType {
  value: string;
  banglaName: string;
  englishName: string;
}

export interface AffiliatedHospital {
  id: number;
  name: string;
  bnName: string;
  numberOfBed: number;
  district: District;
  upazila: Upazila;
  union: Union;
  hospitalType: HospitalType;
  organizationType: OrganizationType;
  lat: string;
  lon: string;
  websiteUrl: string;
  tags: Tag[];
}

export interface Institution {
  id: number;
  acronym: string;
  name: string;
  bnName: string;
  imageUrl: string;
  establishedYear: number;
  enroll: number;
  district: District;
  upazila: Upazila;
  affiliatedHospital: AffiliatedHospital;
  country: Country;
  institutionType: InstitutionType;
  organizationType: OrganizationType;
  lat: number;
  lon: number;
  websiteUrl: string;
  email: string;
  phone: string;
  address: string;
  affiliated: boolean;
  tags: Tag[];
  locationWkt: string;
}

export interface InstitutionResponse extends Institution {
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstitutionListResponse {
  institutions: InstitutionResponse[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message: string;
  status: number;
}
