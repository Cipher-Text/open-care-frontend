import { baseUrl } from "@/config/config";
import { LoginFormData } from "@/validations/login-schema";
import { LoginResponse } from "@/types/auth";

export const login = async (
	loginData: LoginFormData
): Promise<LoginResponse> => {
	const response = await fetch(`${baseUrl}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(loginData),
	});

	if (!response.ok) {
		throw new Error(
			`Failed to login: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (
	refreshToken: string
): Promise<LoginResponse> => {
	const response = await fetch(`${baseUrl}/auth/refresh`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			refreshToken: refreshToken,
		}),
	});

	if (!response.ok) {
		throw new Error(
			`Failed to refresh token: ${response.status} ${response.statusText}`
		);
	}

	return response.json();
};

/**
 * Make an authenticated API request with automatic token refresh
 */
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {}
): Promise<Response> => {
	const { getAuthHeader, refreshAccessToken } = await import("@/lib/auth");

	let authHeader = await getAuthHeader();

	// Make the first request
	let response = await fetch(`${baseUrl}${url}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...authHeader,
			...options.headers,
		},
	});

	// If we get a 401 (Unauthorized), try to refresh the token
	if (response.status === 401) {
		console.log("Access token expired, attempting to refresh...");

		const refreshSuccess = await refreshAccessToken();

		if (refreshSuccess) {
			// Get the new auth header and retry the request
			authHeader = await getAuthHeader();
			response = await fetch(`${baseUrl}${url}`, {
				...options,
				headers: {
					"Content-Type": "application/json",
					...authHeader,
					...options.headers,
				},
			});
		} else {
			// Refresh failed, redirect to login
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
		}
	}

	return response;
};
