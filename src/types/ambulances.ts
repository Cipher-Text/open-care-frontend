import { District, Upazila } from "./locations";

export interface AmbulanceType {
  value: string;
  description: string;
}

export interface HospitalType {
  value: string | null;
  banglaName: string;
  englishName: string;
}

export interface OrganizationType {
  value: string | null;
  displayName: string | null;
  banglaName: string;
  description: string;
}

export interface Hospital {
  id: number;
  name: string;
  bnName: string;
  numberOfBed: number;
  district: District;
  upazila: Upazila | null;
  union: unknown | null;
  hospitalType: HospitalType;
  organizationType: OrganizationType;
  lat: string;
  lon: string;
  websiteUrl: string;
  tags: string[];
}

export interface Ambulance {
  id: number;
  vehicleNumber: string;
  type: AmbulanceType;
  driverName: string;
  driverPhone: string;
  isAvailable: boolean;
  isAffiliated: boolean;
  hospital: Hospital | null;
  upazila: Upazila;
  district: District;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface AmbulancesListResponse {
  ambulances: Ambulance[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message?: string;
  status?: number;
}
