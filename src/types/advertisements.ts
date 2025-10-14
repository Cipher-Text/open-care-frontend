export interface AdvertisementPosition {
  value: string | null;
  position: string;
}

export interface AdvertisementType {
  id: number;
  name: string;
  description: string;
  position: AdvertisementPosition;
  basePrice: number;
  durationInDays: number;
}

export interface AdvertisementTypesResponse {
  types: AdvertisementType[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface Division {
  id: number;
  name: string;
  bnName: string;
  url: string;
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
  url: string;
}

export interface Union {
  id: number;
  upazila: Upazila;
  name: string;
  bnName: string;
  url: string;
}

export interface MedicalSpeciality {
  id: number;
  parentId: number | null;
  name: string;
  bnName: string;
  icon: string;
  imageUrl: string | null;
  description: string | null;
  doctorCount: number;
}

export interface AgeGroup {
  label: string;
  startAge: number;
  endAge: number;
}

export interface Gender {
  name: string;
  banglaName: string;
}

export interface Advertisement {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  targetUrl: string;
  targetType: string;
  targetId: number;
  advTypeId: number;
  advertisementType: AdvertisementType;
  districtId: number;
  district: District;
  upazilaId: number;
  upazila: Upazila;
  unionId: number;
  union: Union;
  medSpecialityId: number;
  medicalSpeciality: MedicalSpeciality;
  ageGroup: AgeGroup;
  gender: Gender;
  startTime: string;
  endTime: string;
  isActive: boolean;
  views: number;
  clicks: number;
}

export interface AdvertisementsResponse {
  advertisements: Advertisement[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
