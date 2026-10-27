import { baseUrl } from "@/config/config";
import type { SignupFormData } from "@/validations/signup-schema";

/**
 * Creates an account with the public self-registration endpoint (user type USER).
 * No token is sent. The backend answers 409 for a duplicate email and 400 for invalid fields;
 * the server's message is passed on so the form can show it.
 */
export const registerUser = async (data: SignupFormData): Promise<void> => {
	const response = await fetch(`${baseUrl}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: data.email.trim(),
			firstName: data.firstName.trim(),
			lastName: data.lastName.trim(),
			// The API accepts digits with an optional leading +, 10 to 15 characters
			phone: data.phone.replace(/[\s-]/g, ""),
			password: data.password,
			bloodGroup: data.bloodGroup,
			gender: data.gender,
			districtId: data.districtId,
		}),
	});

	if (!response.ok) {
		let message = "";
		try {
			message = (await response.json())?.message ?? "";
		} catch {
			// Not JSON, use the fallbacks below
		}
		if (response.status === 429) message = "Too many attempts. Please wait a minute and try again.";
		throw new Error(message || "We could not create your account. Please try again.");
	}
};
