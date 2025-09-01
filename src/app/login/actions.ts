"use server";

import { login } from "@/api/auth";
import { LoginResponse } from "@/types/auth";
import { saveAuthTokens } from "@/lib/auth";

export interface LoginState {
	success: boolean;
	error?: string;
	data?: LoginResponse;
	shouldRedirect?: boolean;
	redirectTo?: string;
}

export async function submitLogin(
	prevState: LoginState,
	formData: FormData
): Promise<LoginState> {
	const username = formData.get("username");
	const password = formData.get("password");

	if (
		!username ||
		!password ||
		typeof username !== "string" ||
		typeof password !== "string"
	) {
		return {
			success: false,
			error: "Invalid form data. Please provide both username and password.",
		};
	}

	try {
		const response = await login({ username, password });

		// Save tokens to cookies using utility function
		await saveAuthTokens(response);

		// Return success state with redirect info
		return {
			success: true,
			data: response,
			shouldRedirect: true,
			redirectTo: "/admin",
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Login failed. Please try again.",
		};
	}
}
