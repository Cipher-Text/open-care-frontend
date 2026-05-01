"use server";

import { redirect } from "next/navigation";
import { clearAuthTokens } from "@/lib/auth";

export async function logout() {
	try {
		// Clear all auth tokens from cookies
		await clearAuthTokens();

		// Redirect to login page
		redirect("/login");
	} catch (error) {
		console.error("Logout failed:", error);
		// Still redirect even if clearing tokens fails
		redirect("/login");
	}
}
