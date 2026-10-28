const envBaseUrl =
	process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

/**
 * The backend API root. A production build must be given it explicitly: there is no fallback to the live API, so a build
 * without the variable fails instead of quietly talking to production. Local development defaults to the backend
 * from the backend repository's docker compose.
 */
const resolveBaseUrl = (): string => {
	if (envBaseUrl) return envBaseUrl.replace(/\/$/, "");
	if (process.env.NODE_ENV === "production") {
		throw new Error(
			"NEXT_PUBLIC_API_BASE_URL is not set. Set it to the API root (for example https://api.example.com/api) before building."
		);
	}
	return "http://localhost:6700/api";
};

export const baseUrl = resolveBaseUrl();
