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
	content: UserProfile[];
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

export interface BloodDonorChoice {
	donor: boolean;
	consentedAt: string | null;
	sharePhone: boolean;
	shareAddress: boolean;
}

/**
 * Choose whether to be listed as a blood donor, and what to share. The only way to change this, and only for yourself;
 * unticking withdraws consent.
 */
export const updateBloodDonorChoice = async (
	choice: Pick<BloodDonorChoice, "donor" | "sharePhone" | "shareAddress">
): Promise<BloodDonorChoice> => {
	const response = await apiPut<BloodDonorChoice>("/profiles/self/blood-donor", choice);

	if (!response.ok || !response.data) {
		throw new Error(response.error || "Failed to save your blood donor choice");
	}

	return response.data;
};

export interface HealthDataConsent {
	consent: boolean;
	consentedAt: string | null;
}

/**
 * Agree to, or withdraw, keeping health vitals. Only for yourself. Without it the backend refuses to save new vitals (422);
 * vitals already stored stay readable and deletable.
 */
export const updateHealthDataConsent = async (consent: boolean): Promise<HealthDataConsent> => {
	const response = await apiPut<HealthDataConsent>("/profiles/self/health-data-consent", { consent });

	if (!response.ok || !response.data) {
		throw new Error(response.error || "Failed to save your health data choice");
	}

	return response.data;
};

export interface PublicPhoneChoice {
	show: boolean;
}

/**
 * A doctor chooses whether the phone number on their profile is shown on the public pages. Only for yourself; hidden unless chosen.
 */
export const updatePublicPhone = async (show: boolean): Promise<PublicPhoneChoice> => {
	const response = await apiPut<PublicPhoneChoice>("/profiles/self/public-phone", { show });

	if (!response.ok || !response.data) {
		throw new Error(response.error || "Failed to save your phone choice");
	}

	return response.data;
};

export type MessageLanguage = "bn" | "en";

/**
 * Choose the language of the text messages sent to you (for example the consent code). Only for yourself; English until chosen.
 */
export const updatePreferredLanguage = async (language: MessageLanguage): Promise<{ language: MessageLanguage }> => {
	const response = await apiPut<{ language: MessageLanguage }>("/profiles/self/language", { language });

	if (!response.ok || !response.data) {
		throw new Error(response.error || "Failed to save your language");
	}

	return response.data;
};

/**
 * Called when a signed-in person switches the site language: if they have not chosen a message language yet, the language
 * they switched to becomes it. A choice they made on their profile is never overwritten. Best effort: failures are ignored.
 */
export const rememberLanguageIfUnset = async (language: MessageLanguage): Promise<void> => {
	try {
		const profile = await apiGet<UserProfile>("/profiles/self", { throwOnError: false });
		if (profile.ok && profile.data && !profile.data.preferredLanguage) {
			await apiPut("/profiles/self/language", { language }, { throwOnError: false });
		}
	} catch {
		// the language switch itself must never fail because of this
	}
};
