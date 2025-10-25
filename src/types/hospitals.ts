import { District, Union, Upazila } from "./locations";
import { DoctorResponse } from "./doctors";

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

export interface MedicalTest {
  id: number;
  parentId: number | null;
  name: string;
  bnName: string;
  alternativeNames: string | null;
  description: string | null;
  hospitalCount: number;
}

export interface HospitalTest {
  id: number;
  hospital: Hospital;
  medicalTest: MedicalTest;
  name: string;
  testCode: string | null;
  category: string | null;
  description: string | null;
  price: number;
  isAvailable: boolean;
  sampleCollectedTime: string | null;
  deliveryTime: string | null;
  isActive: boolean;
}

export interface HospitalAmenity {
  id: number;
  hospital: Hospital;
  type: string;
  name: string;
  price: number;
  quantity: number;
  available: number;
  isActive: boolean;
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

export interface HospitalDetailsResponse {
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
  doctors: DoctorResponse[];
  tests: HospitalTest[];
  amenities: HospitalAmenity[];
}

export interface HospitalListResponse {
  hospitals: Hospital[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message: string;
  status: number;
}
