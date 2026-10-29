"use server";

import { redirect } from "next/navigation";
import { clearAuthTokens } from "@/lib/auth";

export async function logout() {
	try {
		// Clear all auth tokens from cookies
		await clearAuthTokens();
	} catch (error) {
		// Still send the user to the login page even if clearing failed
		console.error("Logout failed:", error);
	}

	// redirect() works by throwing, so it must stay outside the try/catch above
	redirect("/login");
}
