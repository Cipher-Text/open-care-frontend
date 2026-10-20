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
  content: AdvertisementType[];
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
  content: Advertisement[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

/** Body for creating or replacing an advertisement type (PUT replaces every field). */
export interface AdvertisementTypeInput {
  name: string;
  description: string;
  /** An AdvertisementPosition value such as CAROUSEL (see getAdvertisementPositions). */
  position: string;
  basePrice: number;
  durationInDays: number;
}

/** Body for creating or replacing an advertisement. Views and clicks are server-managed. */
export interface AdvertisementInput {
  title: string;
  content: string | null;
  imageUrl: string | null;
  targetUrl: string | null;
  targetType: string;
  targetId: number | null;
  advTypeId: number;
  districtId: number | null;
  upazilaId: number | null;
  unionId: number | null;
  medSpecialityId: number | null;
  ageGroup: string | null;
  gender: string | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AdvertisementPositionOption {
  value: string;
  position: string;
}

export interface AgeGroupOption {
  value: string;
  label: string;
  startAge: number;
  endAge: number;
}

export interface GenderOption {
  value: string;
  displayName: string;
  banglaName: string;
}
