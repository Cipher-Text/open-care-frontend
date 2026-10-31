"use server";

import { redirect } from "next/navigation";
import { logoutSession } from "@/api/auth";
import { clearAuthTokens, getRefreshToken } from "@/lib/auth";

export async function logout() {
	try {
		// End the session in Keycloak too, so a copied refresh token stops working. A failure must not keep the person signed in.
		const refreshToken = await getRefreshToken();
		if (refreshToken) {
			await logoutSession(refreshToken).catch((error) => console.error("Could not end the session in Keycloak:", error));
		}
	} catch (error) {
		console.error("Could not read the refresh token:", error);
	}

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
