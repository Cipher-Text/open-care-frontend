import { baseUrl } from "@/config/config";
import { UserProfile } from "@/types/profile";

/**
 * Get current user's profile
 */
export const getSelfProfile = async (token: string): Promise<UserProfile> => {
  const response = await fetch(`${baseUrl}/profiles/self`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch profile: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Update current user's profile
 */
export const updateSelfProfile = async (
  token: string,
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  const response = await fetch(`${baseUrl}/profiles/self`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update profile: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (
  token: string,
  file: File
): Promise<{ photoUrl: string }> => {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(`${baseUrl}/profiles/self/photo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload photo: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Get all profiles with pagination
 */
export interface ProfilesResponse {
  totalItems: number;
  profiles: UserProfile[];
  totalPages: number;
  currentPage: number;
}

export const getProfiles = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "id",
  sortDir: string = "ASC"
): Promise<ProfilesResponse> => {
  const response = await fetch(
    `${baseUrl}/profiles?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch profiles: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
