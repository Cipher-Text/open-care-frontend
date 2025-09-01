"use server";

import { login } from "@/api/auth";
import { LoginResponse } from "@/types/auth";

export interface LoginState {
	success: boolean;
	error?: string;
	data?: LoginResponse;
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

	console.log(username, password);

	try {
		const response = await login({ username, password });
		console.log("Login response:", response);

		return {
			success: true,
			data: response,
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
