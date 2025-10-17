import { District, Union, Upazila } from "./locations";

export interface HospitalType {
  value: string;
  banglaName: string;
  englishName: string;
}

export interface OrganizationType {
  value: string;
  displayName: string;
  banglaName: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
  displayName: string;
  category: string;
}

export type Hospital = {
  id: number;
  name: string;
  bnName: string;
  numberOfBed: number;
  district: District;
  upazila: Upazila | null;
  union: Union | null;
  hospitalType: HospitalType;
  organizationType: OrganizationType;
  lat: string;
  lon: string;
  websiteUrl: string;
  tags: Tag[];
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
