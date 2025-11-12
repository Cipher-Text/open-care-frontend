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
  username: string | null;
  userType: UserType;
  keycloakUserId: string | null;
  photoUrl: string | null;
  phone: string | null;
  email: string | null;
  name: string;
  bnName: string;
  gender: Gender | null;
  dateOfBirth: string | null;
  bloodGroup: BloodGroup | null;
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
  facebookPageUrl: string | null;
  linkedinProfileUrl: string | null;
  researchGateProfileUrl: string | null;
  xprofileUrl: string | null;
  instagramProfileUrl: string | null;
  youtubeChannelUrl: string | null;
  websiteUrl: string | null;
  blogUrl: string | null;
}
