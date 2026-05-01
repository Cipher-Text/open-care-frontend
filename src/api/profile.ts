"use client";

import { UserProfile } from "@/types/profile";
import { apiGet, apiPost, apiPut, buildUrl } from "@/lib/api-client";

/**
 * Get current user's profile
 */
export const getSelfProfile = async (): Promise<UserProfile> => {
	const response = await apiGet<UserProfile>("/profiles/self");

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch profile");
	}

	return response.data as UserProfile;
};

/**
 * Update current user's profile
 */
export const updateSelfProfile = async (
	profileData: Partial<UserProfile>
): Promise<UserProfile> => {
	const response = await apiPut<UserProfile>("/profiles/self", profileData);

	if (!response.ok) {
		throw new Error(response.error || "Failed to update profile");
	}

	return response.data as UserProfile;
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (
	file: File
): Promise<{ photoUrl: string }> => {
	const formData = new FormData();
	formData.append("photo", file);

	const response = await apiPost<{ photoUrl: string }>(
		"/profiles/self/photo",
		formData,
		{
			headers: {},
			includeAuth: true,
		}
	);

	if (!response.ok) {
		throw new Error(response.error || "Failed to upload photo");
	}

	return response.data as { photoUrl: string };
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
	sortDir: string = "ASC",
	token?: string
): Promise<ProfilesResponse> => {
	const url = buildUrl("/profiles", {
		page,
		size,
		sortBy,
		sortDir,
	});
	const response = await apiGet<ProfilesResponse>(url, {
		includeAuth: !!token,
	});

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch profiles");
	}

	return response.data as ProfilesResponse;
};

/**
 * Get profile by ID with optional blood donations and user activity
 */
export interface ProfileDetailsResponse extends UserProfile {
	userActivity: {
		profileId: number;
		profileName: string;
		profileEmail: string;
		lastLoginTime: string | null;
		lastLogoutTime: string | null;
		lastActivityTime: string | null;
		lastLoginIp: string | null;
		lastLoginDevice: string | null;
		lastLoginBrowser: string | null;
		lastKnownLocationLatitude: number | null;
		lastKnownLocationLongitude: number | null;
		totalLogins: number;
		totalSessions: number;
		avgSessionDurationSeconds: number | null;
		adClickCount: number;
		lastAdSeen: string | null;
		lastAdClicked: string | null;
	} | null;
	bloodDonationList: Array<{
		id: number;
		donationDate: string;
		quantityMl: number;
		hospital: {
			id: number;
			name: string;
			bnName: string;
			district: {
				name: string;
				bnName: string;
			};
		};
		bloodComponent: {
			value: string | null;
			displayName: string | null;
			banglaName: string;
		};
	}> | null;
}

export const getProfileById = async (
	id: number,
	bloodDonations: boolean = true,
	userActivity: boolean = true,
	token?: string
): Promise<ProfileDetailsResponse> => {
	const url = buildUrl(`/profiles/${id}`, {
		bloodDonations,
		userActivity,
	});
	const response = await apiGet<ProfileDetailsResponse>(url, {
		includeAuth: !!token,
	});

	if (!response.ok) {
		throw new Error(response.error || "Failed to fetch profile");
	}

	return response.data as ProfileDetailsResponse;
};
