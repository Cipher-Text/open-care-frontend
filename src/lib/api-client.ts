"use client";

import { baseUrl } from "@/config/config";
import { ApiError } from "@/lib/api-error";
import { clientLogout } from "@/lib/auth-client";
import { bffHeaders, bffUrl } from "@/lib/bff-shared";

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
 * Common fetch wrapper for all API requests. In the browser a signed-in call goes to the same-origin proxy
 * (`/api/bff`), which adds the token from the httpOnly cookie: the browser never holds a token. A call with
 * `includeAuth: false`, or one made on the server, goes straight to the backend without a token.
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

	const viaProxy = includeAuth && typeof window !== "undefined" && !endpoint.startsWith("http");
	const url = viaProxy
		? bffUrl(endpoint)
		: endpoint.startsWith("http")
		? endpoint
		: `${baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

	// Only send Content-Type with a body. On a GET it turns a simple cross-origin
	// request into one that needs a CORS preflight (an extra OPTIONS per call).
	const headers: Record<string, string> = {
		...(fetchOptions.body && !(fetchOptions.body instanceof FormData)
			? { "Content-Type": "application/json" }
			: {}),
		...(viaProxy ? bffHeaders() : {}),
		...customHeaders,
	};

	try {
		const response = await fetch(url, {
			...fetchOptions,
			headers,
			...(viaProxy ? { credentials: "same-origin" as const } : {}),
		});

		const data = await response.json().catch(() => null);

		// Handle 401 Unauthorized - clear session and redirect to login, but only when the call was sent with a session
		if (response.status === 401) {
			if (includeAuth) clientLogout();
			if (throwOnError) {
				throw new ApiError("Unauthorized. Please login again.", 401, data?.code ?? "UNAUTHENTICATED");
			}
			return {
				ok: false,
				status: response.status,
				statusText: response.statusText,
				error: "Unauthorized",
			};
		}

		if (!response.ok && throwOnError) {
			throw new ApiError(
				data?.message || `${response.status} ${response.statusText}`,
				response.status,
				data?.code,
				data?.details
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
/** The data of a successful answer; otherwise the server's message (or `fallback`). One copy for every API module. */
export const unwrap = <T,>(response: { ok: boolean; data?: T; error?: string }, fallback: string): T => {
	if (!response.ok) throw new Error(response.error || fallback);
	return response.data as T;
};

/**
 * A public read: no session is sent, a failure throws an ApiError with the server's message. The answer is returned untyped (like a
 * bare fetch's json()), so the calling function's declared return type is what types it.
 */
export async function publicGet<T = never>(endpoint: string): Promise<T> {
	return (await apiGet<T>(endpoint, { includeAuth: false })).data as T;
}

export async function apiPost<T = unknown>(
	endpoint: string,
	data?: unknown,
	options: Omit<ApiRequestOptions, "body" | "method"> = {}
): Promise<ApiResponse<T>> {
	return apiRequest<T>(endpoint, {
		...options,
		method: "POST",
		body:
			data instanceof FormData
				? data
				: data
				? JSON.stringify(data)
				: undefined,
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
