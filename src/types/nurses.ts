export type UserType = {
  value: string | null;
  displayName: string | null;
  banglaName: string | null;
  keycloakGroupName: string;
  description: string;
};

export type Gender = {
  value: string | null;
  displayName: string | null;
  banglaName: string | null;
};

export type BloodGroup = {
  value: string | null;
  displayName: string | null;
  banglaName: string | null;
};

export type District = {
  id: number;
  name: string;
  bnName: string;
};

export type Upazila = {
  id: number;
  name: string;
  bnName: string;
};

export type Union = {
  id: number;
  name: string;
  bnName: string;
};

export type NurseProfile = {
  id: number;
  username: string | null;
  userType: UserType;
  keycloakUserId: string | null;
  photo: string | null;
  imageUrl?: string;
  phone: string | null;
  email: string | null;
  name: string;
  bnName: string;
  gender: Gender;
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
  linkedinProfileUrl: string | null;
  researchGateProfileUrl: string | null;
  xprofileUrl: string | null;
};

export type NurseResponse = {
  id: number;
  bnmcNo: string;
  startDate: string;
  yearOfExperience: number;
  description: string;
  isActive: boolean;
  isVerified: boolean;
  profile: NurseProfile;
};

export type NurseListResponse = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  nurses: NurseResponse[];
};

export type Nurse = NurseResponse;
