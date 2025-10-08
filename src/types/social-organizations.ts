export interface SocialOrganizationType {
  value: string;
  displayName: string;
  banglaName: string;
}

export interface OriginCountry {
  value: string;
  displayNameEn: string;
  nameBn: string;
  nameNative: string;
  acronym: string;
}

export interface SocialOrganization {
  id: number;
  name: string;
  bnName: string;
  socialOrganizationType: SocialOrganizationType;
  foundedDate: string | null;
  description: string | null;
  address: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  email: string | null;
  phone: string | null;
  originCountry: OriginCountry;
  tags: string[];
}

export interface SocialOrganizationsListResponse {
  socialOrganizations: SocialOrganization[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  message?: string;
  status?: number;
}
