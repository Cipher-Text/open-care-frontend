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
