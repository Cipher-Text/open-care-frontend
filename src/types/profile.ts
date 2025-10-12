export interface UserType {
  value: string;
  displayName: string;
  banglaName: string;
  keycloakGroupName: string;
  description: string;
}

export interface Gender {
  value: string;
  displayName: string;
  banglaName: string;
}

export interface BloodGroup {
  value: string;
  displayName: string;
  bnName: string;
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

export interface UserProfile {
  id: number;
  username: string;
  userType: UserType;
  keycloakUserId: string;
  photo: string | null;
  phone: string;
  email: string;
  name: string;
  bnName: string;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  address: string;
  district: District;
  upazila: Upazila;
  union: Union;
  isBloodDonor: boolean;
  bloodDonationCount: number;
  lastBloodDonationDate: string | null;
  isVolunteer: boolean;
  healthDataConsent: boolean;
  isActive: boolean;
  facebookProfileUrl: string;
  linkedinProfileUrl: string;
  researchGateProfileUrl: string;
  xprofileUrl: string;
}
