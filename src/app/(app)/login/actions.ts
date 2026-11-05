"use server";

import { login, LoginRequestError } from "@/api/auth";
import { loginErrorMessage } from "@/lib/login-errors";
import { saveAuthTokens } from "@/lib/auth";

export interface LoginState {
	success: boolean;
	error?: string;
	shouldRedirect?: boolean;
	redirectTo?: string;
}

/** The message for a person; what the server said stays in the server log. */
function describeFailure(error: unknown): string {
	if (error instanceof LoginRequestError) {
		console.error(`[login] refused: status ${error.status ?? "none"} ${error.detail ?? ""}`.trim());
		return loginErrorMessage(error.status, error.detail);
	}
	console.error("[login] unexpected failure", error instanceof Error ? error.message : error);
	return loginErrorMessage(null);
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
			error: "Enter your username and password.",
		};
	}

	try {
		const response = await login({ username, password });

		// Save tokens to cookies using utility function
		await saveAuthTokens(response, { remember: formData.get("remember-me") === "on" });

		// Return success state with redirect info
		return {
			success: true,
			shouldRedirect: true,
			redirectTo: "/admin",
		};
	} catch (error) {
		return { success: false, error: describeFailure(error) };
	}
}

/**
 * Development-only one-click login accounts.
 *
 * DEV_LOGIN_ACCOUNTS (server-side env in .env.local, never NEXT_PUBLIC_*) is a
 * JSON array: [{"label":"Super admin","username":"superadmin","password":"..."}].
 * Everything here refuses to run unless NODE_ENV is "development".
 */
interface DevAccount {
	label: string;
	username: string;
	password: string;
}

function readDevAccounts(): DevAccount[] {
	if (process.env.NODE_ENV !== "development") return [];
	try {
		const parsed = JSON.parse(process.env.DEV_LOGIN_ACCOUNTS || "[]");
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(a): a is DevAccount =>
				a &&
				typeof a.username === "string" &&
				typeof a.password === "string" &&
				typeof a.label === "string"
		);
	} catch {
		return [];
	}
}

/** Labels and usernames only. Passwords never leave the server. */
export async function getDevLoginAccounts(): Promise<
	{ label: string; username: string }[]
> {
	return readDevAccounts().map(({ label, username }) => ({ label, username }));
}

export async function devLogin(
	prevState: LoginState,
	formData: FormData
): Promise<LoginState> {
	if (process.env.NODE_ENV !== "development") {
		return { success: false, error: "Dev login is only available in development." };
	}

	const requested = formData.get("account");
	const account = readDevAccounts().find((a) => a.username === requested);
	if (!account) {
		return {
			success: false,
			error:
				"Dev account not found. Set DEV_LOGIN_ACCOUNTS in .env.local and restart the dev server.",
		};
	}

	try {
		const response = await login({
			username: account.username,
			password: account.password,
		});
		await saveAuthTokens(response);
		return {
			success: true,
			shouldRedirect: true,
			redirectTo: "/admin",
		};
	} catch (error) {
		return { success: false, error: describeFailure(error) };
	}
}
