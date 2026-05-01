"use client";

import { baseUrl } from "@/config/config";
import { getAuthHeader, clientLogout } from "@/lib/auth-client";

interface ApiRequestOptions extends Omit<RequestInit, "headers"> {
	headers?: Record<string, string>;
	includeAuth?: boolean;
	throwOnError?: boolean;
}

interface ApiResponse<T = unknown> {
	ok: boolean;
	status: number;
	statusText: string;
	data?: T;
	error?: string;
}

/**
 * Common fetch wrapper for all API requests with bearer token support
 * Works on the client side with localStorage tokens
 */
export async function apiRequest<T = unknown>(
	endpoint: string,
	options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
	const {
		includeAuth = true,
		throwOnError = true,
		headers: customHeaders = {},
		...fetchOptions
	} = options;

	const url = endpoint.startsWith("http")
		? endpoint
		: `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...customHeaders,
	};

	// Add authorization header if needed
	if (includeAuth) {
		const authHeaders = getAuthHeader();
		Object.assign(headers, authHeaders);
	}

	try {
		const response = await fetch(url, {
			...fetchOptions,
			headers,
		});

		const data = await response.json().catch(() => null);

		// Handle 401 Unauthorized - clear session and redirect to login
		if (response.status === 401) {
			clientLogout();
			if (throwOnError) {
				throw new Error("Unauthorized. Please login again.");
			}
			return {
				ok: false,
				status: response.status,
				statusText: response.statusText,
				error: "Unauthorized",
			};
		}

		if (!response.ok && throwOnError) {
			throw new Error(
				data?.message || `${response.status} ${response.statusText}`
			);
		}

		return {
			ok: response.ok,
			status: response.status,
			statusText: response.statusText,
			data: data as T,
			error: response.ok ? undefined : data?.message || response.statusText,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		if (throwOnError) {
			throw error;
		}

		return {
			ok: false,
			status: 0,
			statusText: "Error",
			error: errorMessage,
		};
	}
}

/**
 * GET request helper
 */
export async function apiGet<T = unknown>(
	endpoint: string,
	options: Omit<ApiRequestOptions, "body" | "method"> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(endpoint, {
		...options,
		method: "GET",
	});
}

/**
 * POST request helper
 */
export async function apiPost<T = unknown>(
	endpoint: string,
	data?: unknown,
	options: Omit<ApiRequestOptions, "body" | "method"> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(endpoint, {
		...options,
		method: "POST",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * PUT request helper
 */
export async function apiPut<T = unknown>(
	endpoint: string,
	data?: unknown,
	options: Omit<ApiRequestOptions, "body" | "method"> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(endpoint, {
		...options,
		method: "PUT",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * PATCH request helper
 */
export async function apiPatch<T = unknown>(
	endpoint: string,
	data?: unknown,
	options: Omit<ApiRequestOptions, "body" | "method"> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(endpoint, {
		...options,
		method: "PATCH",
		body: data ? JSON.stringify(data) : undefined,
	});
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = unknown>(
	endpoint: string,
	options: Omit<ApiRequestOptions, "body" | "method"> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(endpoint, {
		...options,
		method: "DELETE",
	});
}

/**
 * Build query string from params object
 */
export function buildQueryString(params: Record<string, unknown>): string {
	const queryParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") {
			queryParams.append(key, String(value));
		}
	});

	return queryParams.toString();
}

/**
 * Build full URL with query string
 */
export function buildUrl(
	endpoint: string,
	params?: Record<string, unknown>
): string {
	if (!params || Object.keys(params).length === 0) {
		return endpoint;
	}

	const queryString = buildQueryString(params);
	return `${endpoint}${queryString ? "?" + queryString : ""}`;
}
