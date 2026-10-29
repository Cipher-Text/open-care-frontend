"use server";

import { refreshAccessToken } from "@/lib/auth";

export interface RefreshState {
	success: boolean;
	error?: string;
}

export async function refreshTokenAction(): Promise<RefreshState> {
	try {
		const success = await refreshAccessToken();

		if (success) {
			return {
				success: true,
			};
		} else {
			return {
				success: false,
				error: "Failed to refresh token. Please log in again.",
			};
		}
	} catch (error) {
		console.error("Token refresh failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Token refresh failed.",
		};
	}
}
